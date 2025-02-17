import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppComponent } from '../app.component';
import { Building } from '../Building';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';
import { Floor } from '../Floor';
import { Room } from '../Room';
import { RoomService } from '../room.service';
import { Suite } from '../Suite';
import { DialogEditAndAddSuiteComponent } from '../dialog-edit-and-add-suite/dialog-edit-and-add-suite.component';
import { translates } from '../translates';

@Component({
  selector: 'app-add-suite',
  templateUrl: './add-suite.component.html',
  styleUrls: ['./add-suite.component.css']
})
export class AddSuiteComponent {
  allRoom: Room[] = [];
  allBuilding: Building[] = [];
  selectedFloors: Floor[] = [];
  allSuites: Suite[] = []
  filteredSuites: Suite[] = []
  selectedBuilding: any;
  selectedFloor: any;
  selectedFloorName: string | Floor = 'All';
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
    this.roomService.suiteListUpdated$.subscribe(() => {
      this.allBuilding = AppComponent.buildings;
      this.allRoom = AppComponent.rooms;
      if (this.allBuilding.length > 0) {
        this.allSuites = [];
        const floor = this.allBuilding.find(b => b.id == this.selectedBuilding);
        floor?.floors.forEach(f => {
          this.allSuites = this.allSuites.concat(f.suites);
        })
      }
      console.log(this.allSuites);
      this.getSuitesInFloor();
    });
  }

  onBuildingChange(selectedBuilding: number) {
    this.allSuites = [];
    const floor = this.allBuilding.find(b => b.id == selectedBuilding);
    floor?.floors.forEach(f => {
      this.allSuites = this.allSuites.concat(f.suites);
    })
    this.selectedFloors = floor?.floors || [];
    this.selectedFloor = 'All';
    this.getSuitesInFloor();
  }

  onFloorChange(selectedFloor: any) {
    this.selectedFloor = selectedFloor == 'All' ? 'All' : selectedFloor;
    this.getSuitesInFloor();
  }

  getSuitesInFloor() {
    if (this.selectedBuilding) {
      if (this.selectedFloor == 'All') {
        this.filteredSuites = this.allSuites.filter(suite => suite.building_id == this.selectedBuilding);
      } else {
        this.filteredSuites = this.allSuites.filter(suite =>
          suite.building_id == this.selectedBuilding && suite.floor_id == this.selectedFloor);
      }
    }
    console.log(this.filteredSuites);

  }

  openDialogEditOrAdd(suiteId: number, suiteNumber: number, rooms: Room[], buildingID: number, floorId: number) {
    if (suiteId !== 0 || suiteNumber !== 0 || rooms.length !== 0) {
      this.dialog.open(DialogEditAndAddSuiteComponent, {
        data: { suiteId: suiteId, suiteNumber: suiteNumber, rooms: rooms, buildingID: buildingID, floorId: floorId },
      });
    } else {
      this.dialog.open(DialogEditAndAddSuiteComponent);
    }
  }

  openDeleteDialog(id: number, buildingId: number, floorId: number, name: string): void {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      data: { id: id, buildingId: buildingId, floorId: floorId, name: name },
    });
    dialogRef.componentInstance.refreshListRoom.subscribe(() => {
      this.allRoom = AppComponent.rooms;
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

  getCountRoomInSuite(suite: any): number {
    return suite.rooms.length;
  }
  getNameBuilding(idBulding: number) {
    let nameBulding;
    const name = this.allBuilding.find(b => b.id == idBulding);
    if (name) {
      nameBulding = name.name
    }
    return nameBulding;
  }

  getTranslate(id: string) {
    return translates.getTranslate(id)
  }
}
