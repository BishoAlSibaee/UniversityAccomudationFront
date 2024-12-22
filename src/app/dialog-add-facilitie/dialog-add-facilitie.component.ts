import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../user.service';
import { Building } from '../Building';
import { Floor } from '../Floor';
import { AppComponent } from '../app.component';
import { RoomType } from '../RoomType';
import { ApiLinks } from '../ApiLinks';
import { Room } from '../Room';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Facilitie } from '../Facilitie';
import { RoomService } from '../room.service';

@Component({
  selector: 'app-dialog-add-facilitie',
  templateUrl: './dialog-add-facilitie.component.html',
  styleUrls: ['./dialog-add-facilitie.component.css']
})
export class DialogAddFacilitieComponent {
  private _snackBar = inject(MatSnackBar);
  name_ar: string = ""
  name_en: string = ""
  building_id: number = 0
  buildingId: number = 0;
  floorId: number = 0;
  allBuilding: Building[] = []
  floor: Floor[] = []
  roomTypes: RoomType[] = []
  selectedRoomTypeId: number = 0;
  selectedBuildingName: any;
  selectedFloorNumber: any;
  selectedRoomType: string = ''

  constructor(private client: HttpClient, public dialogRef: MatDialogRef<DialogAddFacilitieComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private roomService: RoomService) {
  }

  ngOnInit() {
    this.allBuilding = AppComponent.buildings;
    this.roomTypes = AppComponent.roomType

  }

  onBuildingChange(selectedBuilding: Building) {
    this.buildingId = selectedBuilding.id
    this.selectedFloorNumber = null;
    this.floorId = 0
    this.floorInBuilding(selectedBuilding.id)
  }

  floorInBuilding(buildingId: number) {
    this.floor = [];
    this.allBuilding.forEach(building => {
      if (building.id === buildingId) {
        this.floor.push(...building.floors)
      }
    })
  }

  onFloorChange(selectedFloor: Floor) {
    this.floorId = selectedFloor.id;
    console.log("Floor = " + this.floorId)
  }

  onRoomTypeChange(roomTypeId: number) {
    this.selectedRoomTypeId = roomTypeId;
  }

  addFacilitie() {
    let params = new FormData();
    params.append("name_ar", this.name_ar);
    params.append("name_en", this.name_en);
    params.append("building_id", this.buildingId.toString());
    params.append("floor_id", this.floorId.toString());
    params.append("room_types_id", this.selectedRoomTypeId.toString());
    const token = localStorage.getItem("token")
    const h = new HttpHeaders({ Authorization: "Bearer " + token, });
    let options = { headers: h };
    this.client.post<any>(ApiLinks.addFacilitie, params, options).subscribe({
      next: (result) => {
        console.log(result)
        if (result.code == 1) {
          console.log("success");
          const newFacilitie = new Facilitie(result.facilitie.id, result.facilitie.name_ar, result.facilitie.name_en, Number(result.facilitie.building_id), Number(result.facilitie.floor_id), result.facilitie.suite_id, Number(result.facilitie.room_types_id), '')
          AppComponent.facilitie.push(newFacilitie)
          console.table(AppComponent.facilitie)
          this.roomService.refreshfacilitieList();
          this.dialogRef.close();
          this.openSnackBar("Add Done", "Ok");
        } else {
          if (result.error.name) {
            this.openSnackBar(result.error, "Ok");
            console.log("Warning");
          }
        }
      }, error: (error) => {
        console.log("Error" + error);
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 6000,
      panelClass: ['custom-snackbar']
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}