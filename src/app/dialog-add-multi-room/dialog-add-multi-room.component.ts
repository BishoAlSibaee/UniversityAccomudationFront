import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiLinks } from '../ApiLinks';
import { AppComponent } from '../app.component';
import { Room } from '../Room';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoomService } from '../room.service';
import { RoomType } from '../RoomType';
import { translates } from '../translates';

@Component({
  selector: 'app-dialog-add-multi-room',
  templateUrl: './dialog-add-multi-room.component.html',
  styleUrls: ['./dialog-add-multi-room.component.css']
})
export class DialogAddMultiRoomComponent {
  private _snackBar = inject(MatSnackBar);
  buildingId: number = 0;
  floorId: number = 0;
  numberOfRoom: number = 0;
  numberRoom: number = 0;
  capacity: number = 0;
  listTypeRoom: RoomType[] = [];
  selectedTypeRoom: string = ''

  constructor(private client: HttpClient, public dialogRef: MatDialogRef<DialogAddMultiRoomComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private roomService: RoomService,) {
    translates.create()
    if (data) {
      this.buildingId = data.buildingId;
      this.floorId = data.floorId;
    }
    this.listTypeRoom = AppComponent.roomType;
  }

  onClickCancel() {
    this.dialogRef.close();
  }

  addMultiRoom() {
    if (this.numberOfRoom === 0 || this.numberRoom === 0 || this.capacity === 0 || this.selectedTypeRoom == "") {
      return this.openSnackBar(this.getTranslate('Required'), "Ok");
    }
    let params = new FormData();
    params.append("buildingId", this.buildingId.toString());
    params.append("floorId", this.floorId.toString());
    params.append("numberOfRoom", this.numberOfRoom.toString());
    params.append("numberRoom", this.numberRoom.toString());
    params.append("typeRoom", this.selectedTypeRoom);
    params.append("capacity", this.capacity.toString());
    const token = localStorage.getItem("token")
    const h = new HttpHeaders({ Authorization: "Bearer " + token, });
    let options = { headers: h };
    this.client.post<any>(ApiLinks.addMultiRoom, params, options).subscribe({
      next: (result) => {
        if (result.code == 1) {
          for (let i = 0; i < result.rooms.length; i++) {
            const room = result.rooms[i];
            const newRoom = new Room(room.id, Number(room.building_id), Number(room.floor_id), room.suite_id, room.number, room.capacity, "", room.type_room);
            AppComponent.rooms.push(newRoom);
          }
          this.roomService.refreshRoomList();
          this.dialogRef.close();
          this.openSnackBar(this.getTranslate('AddDone'), "Ok");
        } else {
          this.openSnackBar(result.error, "Ok");
        }
      }, error: (error) => {
        this.openSnackBar(error, "Ok");
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 6000,
      panelClass: ['custom-snackbar']
    });
  }

  getTranslate(id: string) {
    return translates.getTranslate(id)
  }
}
