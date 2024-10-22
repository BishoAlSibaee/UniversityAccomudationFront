import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, inject, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiLinks } from '../ApiLinks';
import { AppComponent } from '../app.component';
import { RoomService } from '../room.service';

@Component({
  selector: 'app-dialog-delete',
  templateUrl: './dialog-delete.component.html',
  styleUrls: ['./dialog-delete.component.css']
})
export class DialogDeleteComponent {
  id: number = 0;
  buildingId: number = 0;
  floorId: number = 0;
  name: string = "";
  private _snackBar = inject(MatSnackBar);
  @Output() refreshListRoom = new EventEmitter<void>();

  constructor(public dialogRef: MatDialogRef<DialogDeleteComponent>, private roomService: RoomService, private client: HttpClient, @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit() {
    this.id = this.data.id;
    this.buildingId = this.data.buildingId;
    this.floorId = this.data.floorId;
    this.name = this.data.name;
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
    if (this.name === "Building") {
      this.deleteBuliding()
    }
    if (this.name === "Floor") {
      this.deleteFloor()
    }
    if (this.name === "Room") {
      this.deleteRoom()
    }
    if (this.name === "Suite") {
      this.deleteSuite()
    }
  }

  deleteBuliding() {
    console.log("NAME IS = " + this.name)
    let params = new FormData();
    params.append("id_building", this.id.toString());
    const token = localStorage.getItem("token")
    const h = new HttpHeaders({
      Authorization: "Bearer " + token,
    });
    let options = { headers: h };
    this.client.post<any>(ApiLinks.deleteBuilding, params, options).subscribe({
      next: (result) => {
        console.log(result);
        if (result.code == 1) {
          console.log("success");
          const index = AppComponent.buildings.findIndex(building => building.id === this.id);
          if (index !== -1) {
            AppComponent.buildings.splice(index, 1);
            AppComponent.rooms = AppComponent.rooms.filter(room => room.building_id !== this.id);
            this.openSnackBar("Delete Done", "Ok");
          }
          this.roomService.refreshRoomList();
          this.roomService.refreshFloorList();
        } else {
          console.log("Warning");
        }
      }, error: (error) => {
        console.log("Error" + error);
      }
    });
  }

  deleteFloor() {
    console.log("NAME IS = " + this.name)
    let params = new FormData();
    params.append("id_building", this.buildingId.toString());
    params.append("id_floor", this.id.toString());
    const token = localStorage.getItem("token")
    const h = new HttpHeaders({
      Authorization: "Bearer " + token,
    });
    let options = { headers: h };
    this.client.post<any>(ApiLinks.deleteFloor, params, options).subscribe({
      next: (result) => {
        console.log(result);
        if (result.code == 1) {
          console.log("success");
          const building = AppComponent.buildings.find(b => b.id === this.buildingId);
          if (building) {
            const floorIndex = building.floors.findIndex(floor => floor.id === this.id);
            if (floorIndex !== -1) {
              building.floors.splice(floorIndex, 1);
              AppComponent.rooms = AppComponent.rooms.filter(room => !(room.floor_id === this.id && room.building_id === this.buildingId));
              this.openSnackBar("Delete Done", "Ok");
            } else {
              console.log("Not Found Data");
            }
          }
          this.roomService.refreshRoomList();
        } else {
          this.openSnackBar("Not deleted try again", "Ok");
          console.log("Warning");
        }
      }, error: (error) => {
        console.log("Error" + error);
      }
    });
  }

  deleteRoom() {
    console.log("NAME IS = " + this.name)
    let params = new FormData();
    params.append("id", this.id.toString());
    const token = localStorage.getItem("token")
    const h = new HttpHeaders({
      Authorization: "Bearer " + token,
    });
    let options = { headers: h };
    this.client.post<any>(ApiLinks.deleteRoom, params, options).subscribe({
      next: (result) => {
        console.log(result);
        if (result.code == 1) {
          console.log("success");
          const roomIndex = AppComponent.rooms.findIndex(r => r.id === this.id);
          if (roomIndex !== -1) {
            AppComponent.rooms.splice(roomIndex, 1);
            this.refreshListRoom.emit();
            this.openSnackBar("Delete Done", "Ok");
          }
        } else {
          this.openSnackBar("Not deleted try again", "Ok");
          console.log("Warning");
        }
      }, error: (error) => {
        console.log("Error" + error);
      }
    });
  }

  deleteSuite() {
    console.log("NAME IS = " + this.name)
    let params = new FormData();
    params.append("id_building", this.buildingId.toString());
    params.append("id_suite", this.id.toString());
    const token = localStorage.getItem("token")
    const h = new HttpHeaders({
      Authorization: "Bearer " + token,
    });
    let options = { headers: h };
    this.client.post<any>(ApiLinks.deleteSuite, params, options).subscribe({
      next: (result) => {
        console.log(result);
        if (result.code == 1) {
          console.log("success");
          const building = AppComponent.buildings.find(b => b.id === this.buildingId);
          if (building) {
            const floor = building.floors.find(f => f.id === this.floorId);
            if (floor) {
              const suiteIndex = floor.suites.findIndex(sI => sI.id === this.id)
              if (suiteIndex !== -1) {
                floor.suites.splice(suiteIndex, 1)
                // AppComponent.rooms = AppComponent.rooms.filter(room => !(room.floor_id === this.id && room.building_id === this.buildingId));
                this.openSnackBar("Delete Done", "Ok");

              } else {
                console.log("Not Found Data");
              }
            }
          }
          this.roomService.refreshSuiteList();
        } else {
          this.openSnackBar("Not deleted try again", "Ok");
          console.log("Warning");
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

}