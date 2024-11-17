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
  selectedBuilding: Building | null = null;
  selectedFloor: Floor | null = null;
  selectedFloorName: string | Floor = 'all';
  filteredRooms: Room[] = [];

  constructor(public dialog: MatDialog, private roomService: RoomService) { }

  ngOnInit() {
    this.allBuilding = AppComponent.buildings;
    this.allRoom = AppComponent.rooms;
    if (this.allBuilding.length > 0) {
      this.selectedBuilding = this.allBuilding[0];
      this.allSuites = [];
      this.allBuilding[0].floors.forEach(f => {
        this.allSuites = this.allSuites.concat(f.suites);
      });
      console.log(" ALL SUITES =  " + this.allSuites.length)
      this.onBuildingChange(this.selectedBuilding);
    }
    this.roomService.suiteListUpdated$.subscribe(() => {
      this.allBuilding = AppComponent.buildings;
      this.allRoom = AppComponent.rooms;
      if (this.allBuilding.length > 0) {
        this.allSuites = [];
        this.allBuilding[0].floors.forEach(f => {
          this.allSuites = this.allSuites.concat(f.suites);
        });
        console.log("=========================================")
        console.log("هون لازم يعمل رفرش للسويتات")
        this.allRoom.forEach(r => {
          console.log(" AppComponent.rooms =  " + r.id + "  " + r.number)
        })
        console.log(" AppComponent.rooms =  " + this.allRoom.length)
        console.log("=========================================")
      }
      this.getSuitesInFloor();
    });
  }

  onBuildingChange(selectedBuilding: Building) {
    this.selectedFloors = selectedBuilding.floors || [];
    this.selectedFloor = null;
    // this.filterRooms();
    this.getSuitesInFloor();
  }

  onFloorChange(selectedFloor: any) {
    this.selectedFloor = selectedFloor === 'all' ? null : selectedFloor;
    this.getSuitesInFloor();
  }

  getSuitesInFloor() {
    if (this.selectedBuilding) {
      if (this.selectedFloor === null) {
        this.filteredSuites = this.allSuites.filter(suite => suite.building_id === this.selectedBuilding?.id);
      } else {
        this.filteredSuites = this.allSuites.filter(suite =>
          suite.building_id === this.selectedBuilding?.id && suite.floor_id === this.selectedFloor?.id);
      }
    }
    console.log(" ALL filteredSuites =  " + this.filteredSuites.length)

  }

  openDialogEditOrAdd(suiteId: number, suiteNumber: number, rooms: Room[], buildingID: number, floorId: number) {
    if (suiteId !== 0 || suiteNumber !== 0 || rooms.length !== 0) {
      const dialogRef = this.dialog.open(DialogEditAndAddSuiteComponent, {
        data: { suiteId: suiteId, suiteNumber: suiteNumber, rooms: rooms, buildingID: buildingID, floorId: floorId }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    } else {
      const dialogRef = this.dialog.open(DialogEditAndAddSuiteComponent);
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }
  }

  openDeleteDialog(id: number, buildingId: number, floorId: number, name: string): void {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      data: { id: id, buildingId: buildingId, floorId: floorId, name: name }
    });
    dialogRef.componentInstance.refreshListRoom.subscribe(() => {
      console.log("ENTER ")
      this.allRoom = AppComponent.rooms;
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

  getCountRoomInSuite(suite: any): number {
    return suite.rooms.length;
  }
}



