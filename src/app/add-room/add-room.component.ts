import { Component } from '@angular/core';
import { Room } from '../Room';
import { AppComponent } from '../app.component';
import { Building } from '../Building';
import { Floor } from '../Floor';
import { DialogEditAndAddRoomComponent } from '../dialog-edit-and-add-room/dialog-edit-and-add-room.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';
import { RoomService } from '../room.service';
import { translates } from '../translates';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.css']
})
export class AddRoomComponent {
  allRoom: Room[] = [];
  allBuilding: Building[] = [];
  selectedFloors: Floor[] = [];
  selectedBuilding: any;
  selectedFloor: any;
  filteredRooms: Room[] = [];

  constructor(public dialog: MatDialog, private roomService: RoomService) {
    translates.create()
  }

  ngOnInit() {
    this.allBuilding = AppComponent.buildings;
    this.allRoom = AppComponent.rooms;
    if (this.allBuilding.length > 0) {
      this.selectedBuilding = this.allBuilding[0].id;
      this.onBuildingChange(this.selectedBuilding);
    }
    this.roomService.roomListUpdated$.subscribe(() => {
      this.refreshRoomList();
    });
  }

  onBuildingChange(id: number) {
    const floor = this.allBuilding.find(b => b.id == id);
    this.selectedFloors = floor?.floors || [];
    this.selectedFloor = 'All';
    this.filterRooms();
  }

  onFloorChange(selectedFloor: any) {
    this.selectedFloor = selectedFloor == 'All' ? 'All' : selectedFloor;
    this.filterRooms();
  }

  filterRooms() {
    this.filteredRooms = [];
    if (this.selectedBuilding) {
      if (this.selectedFloor == 'All') {
        this.filteredRooms = this.allRoom.filter(room => room.building_id == this.selectedBuilding);
      } else {
        this.filteredRooms = this.allRoom.filter(room => room.building_id == this.selectedBuilding && room.floor_id == this.selectedFloor);
      }
      this.filteredRooms.sort((a, b) => a.number - b.number);
    }
  }

  openDialogEditOrAdd(roomId: number, roomNumber: number, room_types_id: number, roomCapacity: number) {

    if (roomId !== 0 || roomNumber !== 0 || room_types_id !== 0 || roomCapacity !== 0) {
      this.dialog.open(DialogEditAndAddRoomComponent, {
        data: { roomId: roomId, roomNumber: roomNumber, roomType: room_types_id, roomCapacity: roomCapacity },
      });
    } else {
      const dialogRef = this.dialog.open(DialogEditAndAddRoomComponent);
      dialogRef.componentInstance.roomAdded.subscribe(() => {
        this.allRoom = AppComponent.rooms;
        this.filterRooms();
      });
    }
  }

  openDeleteDialog(id: number, buildingId: number, floorId: number, name: string): void {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      data: { id: id, buildingId: buildingId, floorId: floorId, name: name },
      panelClass: ['dialog-panel']
    });
    dialogRef.componentInstance.refreshListRoom.subscribe(() => {
      this.allRoom = AppComponent.rooms;
      this.filterRooms();
    });
  }

  getNameBuilding(idBulding: number) {
    let nameBulding;
    const name = this.allBuilding.find(b => b.id == idBulding);
    if (name) {
      nameBulding = name.name
    }
    return nameBulding;
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

  getTranslate(id: string) {
    return translates.getTranslate(id)
  }
}
