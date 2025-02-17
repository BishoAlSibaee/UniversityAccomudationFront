import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, inject, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiLinks } from '../ApiLinks';
import { AppComponent } from '../app.component';
import { Building } from '../Building';
import { Floor } from '../Floor';
import { Room } from '../Room';
import { RoomType } from '../RoomType';
import { translates } from '../translates';

@Component({
  selector: 'app-dialog-edit-and-add-room',
  templateUrl: './dialog-edit-and-add-room.component.html',
  styleUrls: ['./dialog-edit-and-add-room.component.css']
})

export class DialogEditAndAddRoomComponent {
  private _snackBar = inject(MatSnackBar);
  buildingId: number = 0;
  floorId: number = 0;
  floorNumber: number = 0;
  roomId: number = 0;
  roomNumber: number = 0;
  capacityRoom: number = 0;
  typeRoom: number = 0;
  title: string = this.getTranslate('AddNewRoom');
  nameBtn: string = this.getTranslate('Add');
  allBuilding: Building[] = [];
  floor: Floor[] = [];
  rooms: Room[] = [];
  roomType: RoomType[] = [];
  selectedCapacity: string = '';
  selectedBuildingName: any;
  selectedFloorNumber: any;
  @Output() roomAdded = new EventEmitter<void>();

  constructor(private client: HttpClient, public dialogRef: MatDialogRef<DialogEditAndAddRoomComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    translates.create()
    if (data) {
      this.roomId = data.roomId || 0;
      this.roomNumber = data.roomNumber || 0;
      this.capacityRoom = data.roomCapacity || 0;
      this.typeRoom = data.roomType || 0;
      this.title = this.getTranslate('UpdateRoom');
      this.nameBtn = this.getTranslate('Update');
    }
  }

  ngOnInit() {
    this.allBuilding = AppComponent.buildings;
    this.rooms = AppComponent.rooms;
    this.roomType = AppComponent.roomType
  }

  onBuildingChange(selectedBuilding: number) {
    this.buildingId = selectedBuilding
    this.selectedFloorNumber = null;
    this.floorId = 0
    this.floorInBuilding(selectedBuilding)
  }

  floorInBuilding(buildingId: number) {
    this.floor = [];
    const building = this.allBuilding.find(b => b.id == buildingId);
    if (building) {
      this.floor.push(...building.floors);
    }
  }

  onFloorChange(selectedFloor: number) {
    this.floorId = selectedFloor;
  }

  onClickCancel(): void {
    this.dialogRef.close();
  }
  onClickOk() {
    if (this.title === this.getTranslate('UpdateRoom') && this.nameBtn === this.getTranslate('Update')) {
      this.updateRoom()
    } else {
      this.addRoom();
    }
  }

  addRoom() {
    if (this.buildingId === 0 && this.floorNumber === 0 && this.floorId === 0 && this.typeRoom == 0 && this.capacityRoom === 0) {
      return this.openSnackBar(this.getTranslate('Required'), "Ok");
    }
    let params = new FormData();
    params.append("building_id", this.buildingId.toString());
    params.append("floor_id", this.floorId.toString());
    params.append("suite_id", "0");
    params.append("number", this.roomNumber.toString());
    params.append("type_room", this.typeRoom.toString());
    params.append("capacity", this.capacityRoom.toString());
    const token = localStorage.getItem("token")
    const h = new HttpHeaders({ Authorization: "Bearer " + token, });
    let options = { headers: h };
    this.client.post<any>(ApiLinks.addRoom, params, options).subscribe({
      next: (result) => {
        if (result.code == 1) {
          const newRoom = new Room(0, 0, 0, 0, 0, 0, "", 0);
          newRoom.id = result.room.id
          newRoom.building_id = Number(result.room.building_id)
          newRoom.floor_id = Number(result.room.floor_id)
          newRoom.suite_id = Number(result.room.suite_id)
          newRoom.number = Number(result.room.number);
          newRoom.room_types_id = result.room.type_room;
          newRoom.capacity = result.room.capacity
          AppComponent.rooms = [...AppComponent.rooms, newRoom];
          this.roomAdded.emit();
          this.dialogRef.close();
          this.openSnackBar(this.getTranslate('AddDone'), "Ok");
        } else {
          if (result.error.name) {
            this.openSnackBar(result.error.name, "Ok");
          }
          if (result.error.number) {
            this.openSnackBar(result.error.number, "Ok");
          }
          if (result.error) {
            this.openSnackBar(result.error, "Ok");
          }

        }
      }, error: (error) => {
        this.openSnackBar(error, "Ok");
      }
    });
  }

  updateRoom() {
    if (this.roomId === 0 || this.roomNumber === 0 || this.capacityRoom === 0) {
      return this.openSnackBar(this.getTranslate('Required'), "Ok");
    }
    let params = new FormData();
    params.append("id", this.roomId.toString());
    params.append("number", this.roomNumber.toString());
    params.append("room_types_id", this.typeRoom.toString());
    params.append("capacity", this.capacityRoom.toString());
    const token = localStorage.getItem("token")
    const h = new HttpHeaders({ Authorization: "Bearer " + token, });
    let options = { headers: h };
    this.client.post<any>(ApiLinks.updateRoom, params, options).subscribe({
      next: (result) => {
        if (result.code == 1) {
          const room = AppComponent.rooms.find(r => r.id === this.roomId)
          if (room) {
            room.number = this.roomNumber;
            room.room_types_id = this.typeRoom;
            room.capacity = this.capacityRoom;
          }
          this.dialogRef.close();
          this.openSnackBar(this.getTranslate('UpdateDone'), "Ok");
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

  showList(): boolean {
    if (this.nameBtn === this.getTranslate("Update")) {
      return false
    }
    return true
  }
  getTranslate(id: string) {
    return translates.getTranslate(id)
  }
}
