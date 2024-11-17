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
  roomId: number = 0
  roomNumber: number = 0;
  capacityRoom: number = 0;
  typeRoom: number = 0;
  title: string = "Add New Room"
  nameBtn: string = "Add"
  allBuilding: Building[] = []
  floor: Floor[] = []
  rooms: Room[] = []
  roomType: RoomType[] = []
  selectedCapacity: string = ''
  selectedBuildingName: any;
  selectedFloorNumber: any;
  @Output() roomAdded = new EventEmitter<void>();

  constructor(private client: HttpClient, public dialogRef: MatDialogRef<DialogEditAndAddRoomComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) {
      this.roomId = data.roomId || 0;
      this.roomNumber = data.roomNumber || 0;
      this.capacityRoom = data.roomCapacity || 0;
      this.typeRoom = data.roomType || 0;
      this.title = "Update Room"
      this.nameBtn = "Update"
    }
  }

  ngOnInit() {
    this.allBuilding = AppComponent.buildings;
    this.rooms = AppComponent.rooms;
    this.roomType = AppComponent.roomType
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

  onClickCancel(): void {
    this.dialogRef.close();
  }

  onClickOk() {
    if (this.title === "Update Room" && this.nameBtn === "Update") {
      console.log(this.nameBtn)
      this.updateRoom()
    } else {
      console.log(this.nameBtn)
      this.addRoom();
    }
  }

  addRoom() {
    if (this.buildingId === 0 && this.floorNumber === 0 && this.floorId === 0 && this.typeRoom == 0 && this.capacityRoom === 0) {
      return this.openSnackBar("All Required", "Ok");
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
        console.log(result)
        if (result.code == 1) {
          console.log("success");
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
          this.openSnackBar("Add Done", "Ok");
        } else {
          if (result.error.name) {
            this.openSnackBar(result.error.name, "Ok");
            console.log("Warning");
          }
          if (result.error.number) {
            this.openSnackBar(result.error.number, "Ok");
            console.log("Warning");
          }
          if (result.error) {
            this.openSnackBar(result.error, "Ok");
            console.log("Warning");
          }

        }
      }, error: (error) => {
        console.log("Error" + error);
      }
    });
  }

  updateRoom() {
    if (this.roomId === 0 || this.roomNumber === 0 || this.floorId === 0 || this.typeRoom == 0 || this.capacityRoom === 0) {
      return this.openSnackBar("All Required", "Ok");
    }
    let params = new FormData();
    params.append("id", this.roomId.toString());
    params.append("number", this.roomNumber.toString());
    params.append("type_room", this.typeRoom.toString());
    params.append("capacity", this.capacityRoom.toString());
    const token = localStorage.getItem("token")
    const h = new HttpHeaders({ Authorization: "Bearer " + token, });
    let options = { headers: h };
    this.client.post<any>(ApiLinks.updateRoom, params, options).subscribe({
      next: (result) => {
        console.log(result);
        if (result.code == 1) {
          console.log("success");
          console.log(result);
          const room = AppComponent.rooms.find(r => r.id === this.roomId)
          if (room) {
            room.number = this.roomNumber;
            room.room_types_id = this.typeRoom;
            room.capacity = this.capacityRoom;
          }
          this.dialogRef.close();
          this.openSnackBar("Update Done", "Ok");
        } else {
          console.log("Warning");
          this.openSnackBar(result.error, "Ok");
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

  showList(): boolean {
    if (this.nameBtn === "Update") {
      return false
    }
    return true
  }
}
