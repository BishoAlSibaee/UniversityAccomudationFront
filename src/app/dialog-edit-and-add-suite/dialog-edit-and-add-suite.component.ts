import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, inject, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiLinks } from '../ApiLinks';
import { AppComponent } from '../app.component';
import { Building } from '../Building';
import { DialogEditAndAddRoomComponent } from '../dialog-edit-and-add-room/dialog-edit-and-add-room.component';
import { Floor } from '../Floor';
import { Room } from '../Room';
import { RoomService } from '../room.service';
import { translates } from '../translates';

@Component({
  selector: 'app-dialog-edit-and-add-suite',
  templateUrl: './dialog-edit-and-add-suite.component.html',
  styleUrls: ['./dialog-edit-and-add-suite.component.css']
})
export class DialogEditAndAddSuiteComponent {
  private _snackBar = inject(MatSnackBar);
  buildingId: number = 0;
  floorId: number = 0;
  roomInSuite: Room[] = [];
  suiteNumber: number = 0;
  suiteId: number = 0;
  title: string = this.getTranslate('AddNewSuite')
  nameBtn: string = this.getTranslate('Add')
  allBuilding: Building[] = []
  floor: Floor[] = []
  rooms: Room[] = []
  selectedRoomIds: number[] = [];
  filteredRooms: Room[] = [];
  selectedBuildingName: any;
  selectedFloorNumber: any;
  isUpdate: boolean = false;
  room_ids_to_add: number[] = []
  room_ids_to_remove: number[] = []
  temporaryRemovedRooms: Room[] = [];

  @Output() roomAdded = new EventEmitter<void>();
  removedRooms: any[] = [];

  constructor(private client: HttpClient, public dialogRef: MatDialogRef<DialogEditAndAddRoomComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private roomService: RoomService) {
    translates.create()
    this.room_ids_to_add = []
    this.room_ids_to_remove = []
    if (data) {
      this.suiteId = data.suiteId || 0;
      this.roomInSuite = [...data.rooms];
      this.suiteNumber = this.data.suiteNumber
      this.floorId = data.floorId || 0
      this.buildingId = data.buildingID || 0
      this.title = this.getTranslate('UpdateSuite')
      this.nameBtn = this.getTranslate('Update')
      this.isUpdate = true
    }
  }

  ngOnInit() {
    this.allBuilding = AppComponent.buildings;
    this.rooms = AppComponent.rooms;
    if (this.nameBtn === this.getTranslate('Update')) {
      this.filteredRooms = this.rooms.filter(r => r.building_id === this.buildingId && r.floor_id === this.floorId && r.suite_id === 0)
    }
  }

  onBuildingChange(selectedBuilding: number) {
    this.filteredRooms = []
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
    this.filterRooms();
  }

  filterRooms() {
    this.filteredRooms = this.rooms.filter(r => r.building_id == this.buildingId && r.floor_id == this.floorId && r.suite_id == 0)
  }

  onClickCancel(): void {
    this.dialogRef.close();
    this.room_ids_to_add = [];
    this.room_ids_to_remove = [];
  }

  onClickOk() {
    if (this.title === this.getTranslate('UpdateSuite') && this.nameBtn === this.getTranslate('Update')) {
      this.updateSuite()
    } else {
      this.addSuite();
    }
  }

  addSuite() {
    if (this.buildingId === 0 || this.floorId === 0 || this.suiteNumber === 0 || this.selectedRoomIds.length === 0) {
      return this.openSnackBar(this.getTranslate('Required'), "Ok");
    }
    let params = new FormData();
    params.append("building_id", this.buildingId.toString());
    params.append("floor_id", this.floorId.toString());
    params.append("number", this.suiteNumber.toString());
    params.append("room_ids", this.selectedRoomIds.join('-'));
    const token = localStorage.getItem("token")
    const h = new HttpHeaders({ Authorization: "Bearer " + token, });
    let options = { headers: h };
    this.client.post<any>(ApiLinks.addSuite, params, options).subscribe({
      next: (result) => {
        if (result.code == 1) {
          const newSuite = {
            id: Number(result.suite.id),
            number: result.suite.number,
            building_id: Number(result.suite.building_id),
            floor_id: Number(result.suite.floor_id),
            rooms: result.rooms,
          };
          const building = AppComponent.buildings.find(b => b.id == this.buildingId);
          const floor = building?.floors.find(f => f.id == this.floorId);
          floor?.suites.push(newSuite);
          // AppComponent.rooms = AppComponent.rooms.filter(room => !this.selectedRoomIds.includes(room.id));
          this.roomService.refreshSuiteList();
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

  updateSuite() {
    if (!this.suiteNumber) {
      return this.openSnackBar(this.getTranslate('Required'), "Ok");

    }
    let params = new FormData();
    params.append("id", this.suiteId.toString());

    if (this.suiteNumber) {
      params.append("number", this.suiteNumber.toString());
    }

    if (this.room_ids_to_add.length > 0) {
      params.append("room_ids_to_add", this.room_ids_to_add.join('-'));
    }
    if (this.room_ids_to_remove.length > 0) {
      params.append("room_ids_to_remove", this.room_ids_to_remove.join('-'));
    } const token = localStorage.getItem("token")
    const h = new HttpHeaders({ Authorization: "Bearer " + token, });
    let options = { headers: h };
    this.client.post<any>(ApiLinks.updateSuite, params, options).subscribe({
      next: (result) => {
        if (result.code == 1) {
          const building = AppComponent.buildings.find(b => b.id === this.buildingId);
          const floor = building?.floors.find(f => f.id === this.floorId);
          const suiteIndex = floor?.suites.findIndex(suite => suite.id === this.suiteId);
          if (suiteIndex !== undefined && suiteIndex !== -1 && floor) {
            floor.suites[suiteIndex] = {
              id: this.suiteId,
              number: this.suiteNumber,
              building_id: this.buildingId,
              floor_id: this.floorId,
              rooms: [...this.roomInSuite]
            };
          }
          // if (this.room_ids_to_add.length > 0) {
          //   AppComponent.rooms = AppComponent.rooms.filter(room => !this.room_ids_to_add.includes(room.id));
          //   AppComponent.rooms.sort((a, b) => a.number - b.number);
          // }
          // if (this.temporaryRemovedRooms.length > 0) {
          //   const uniqueRemovedRooms = this.temporaryRemovedRooms.filter(removedRoom =>
          //     !AppComponent.rooms.some(room => room.id === removedRoom.id)
          //   );
          //   if (uniqueRemovedRooms.length > 0) {
          //     AppComponent.rooms = [...AppComponent.rooms, ...uniqueRemovedRooms];
          //     AppComponent.rooms.sort((a, b) => a.number - b.number);
          //   }
          //   this.temporaryRemovedRooms = [];
          // }
          this.roomService.refreshSuiteList();
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
    if (this.nameBtn === this.getTranslate('Update')) {
      return false
    }
    return true
  }

  toggleRoomSelection(roomId: number, action: String) {
    if (this.nameBtn === this.getTranslate('Add')) {
      const index = this.selectedRoomIds.indexOf(roomId);
      if (index > -1) {
        this.selectedRoomIds.splice(index, 1);
      } else {
        this.selectedRoomIds.push(roomId);
      }

    } else {
      const roomIndexInSuite = this.roomInSuite.findIndex(r => r.id === roomId);
      const roomIndexInFiltered = this.filteredRooms.findIndex(r => r.id === roomId);
      if (roomIndexInSuite !== -1) {
        if (action === this.getTranslate('Delete')) {
          const removedRoom = this.roomInSuite.splice(roomIndexInSuite, 1)[0];
          removedRoom.suite_id = 0
          this.filteredRooms.push(removedRoom);
          this.temporaryRemovedRooms.push(removedRoom);
          this.filteredRooms.sort((a, b) => a.number - b.number);
          this.room_ids_to_remove.push(roomId);
          this.room_ids_to_add = this.room_ids_to_add.filter(id => id !== roomId);
          this.removedRooms.push(removedRoom);
        }
      } else {
        if (action === this.getTranslate('Add')) {
          if (roomIndexInFiltered !== -1) {
            const addedRoom = this.filteredRooms.splice(roomIndexInFiltered, 1)[0];
            addedRoom.suite_id = this.suiteId
            this.roomInSuite.push(addedRoom);
            this.roomInSuite.sort((a, b) => a.number - b.number);

            this.room_ids_to_add.push(roomId);
            this.room_ids_to_remove = this.room_ids_to_remove.filter(id => id !== roomId);
          }
        }
      }
    }
  }

  getTranslate(id: string) {
    return translates.getTranslate(id)
  }

}

