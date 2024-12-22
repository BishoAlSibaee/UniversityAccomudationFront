import { Component } from '@angular/core';
import { Room } from '../Room';
import { AppComponent } from '../app.component';
import { Building } from '../Building';
import { Floor } from '../Floor';
import { DialogEditAndAddRoomComponent } from '../dialog-edit-and-add-room/dialog-edit-and-add-room.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';
import { RoomService } from '../room.service';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.css']
})
export class AddRoomComponent {
  allRoom: Room[] = [];
  allBuilding: Building[] = [];
  selectedFloors: Floor[] = [];
  selectedBuilding: Building | null = null;
  selectedFloor: Floor | null = null;
  selectedFloorName: string | Floor = 'all';
  filteredRooms: Room[] = [];
  roomInSuite: Room[] = [];

  constructor(public dialog: MatDialog, private roomService: RoomService) { }

  ngOnInit() {
    this.allBuilding = AppComponent.buildings;
    this.allRoom = AppComponent.rooms;

    if (this.allBuilding.length > 0) {
      this.selectedBuilding = this.allBuilding[0];
      this.onBuildingChange(this.selectedBuilding);
    }
    this.roomService.roomListUpdated$.subscribe(() => {
      this.refreshRoomList();
    });
  }

  onBuildingChange(selectedBuilding: Building) {
    this.selectedFloors = selectedBuilding.floors || [];
    this.selectedFloor = null;
    this.filterRooms();
  }

  onFloorChange(selectedFloor: any) {
    this.selectedFloor = selectedFloor === 'all' ? null : selectedFloor;
    this.filterRooms();
  }

  filterRooms() {
    this.filteredRooms = [];
    if (this.selectedBuilding) {
      if (this.selectedFloor === null) {
        this.filteredRooms = this.allRoom.filter(room => room.building_id === this.selectedBuilding?.id);
      } else {
        this.filteredRooms = this.allRoom.filter(room => room.building_id === this.selectedBuilding?.id && room.floor_id === this.selectedFloor?.id);
      }
      this.selectedBuilding.floors.forEach(floor => {
        if (this.selectedFloor === null || floor.id === this.selectedFloor?.id) {
          floor.suites.forEach(suite => {
            this.filteredRooms.push(...suite.rooms);
          });
        }
      });
      this.filteredRooms.sort((a, b) => a.number - b.number);
    }
  }

  openDialogEditOrAdd(roomId: number, roomNumber: number, room_types_id: number, roomCapacity: number) {
    if (roomId !== 0 && roomNumber !== 0 && room_types_id !== 0 && roomCapacity !== 0) {
      const dialogRef = this.dialog.open(DialogEditAndAddRoomComponent, {
        data: { roomId: roomId, roomNumber: roomNumber, roomType: room_types_id, roomCapacity: roomCapacity },
        panelClass: ['dialog-panel']
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    } else {
      const dialogRef = this.dialog.open(DialogEditAndAddRoomComponent, {
        panelClass: ['dialog-panel']
      });
      dialogRef.componentInstance.roomAdded.subscribe(() => {
        this.allRoom = AppComponent.rooms;
        this.filterRooms();
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }
  }

  openDeleteDialog(id: number, buildingId: number, floorId: number, name: string): void {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      data: { id: id, buildingId: buildingId, floorId: floorId, name: name },
      panelClass: ['dialog-panel']
    });
    dialogRef.componentInstance.refreshListRoom.subscribe(() => {
      console.log("ENTER ")
      this.allRoom = AppComponent.rooms;
      this.filterRooms();
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Item deleted');
      } else {
        console.log('Deletion cancelled');
      }
    });
  }

  getNumberFloor(idFloor: number) {
    let floorNumber: number | undefined;
    this.selectedFloors.forEach(floor => {
      if (floor.id === idFloor) {
        floorNumber = floor.number;
      }
    });
    return floorNumber;
  }

  refreshRoomList() {
    this.allRoom = AppComponent.rooms;
    this.filterRooms();
  }
}
