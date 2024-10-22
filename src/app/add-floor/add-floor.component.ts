import { Component, ViewChild } from '@angular/core';
import { Floor } from '../Floor';
import { AppComponent } from '../app.component';
import { Building } from '../Building';
import { DialogEditAndAddFloorComponent } from '../dialog-edit-and-add-floor/dialog-edit-and-add-floor.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';
import { AddRoomComponent } from '../add-room/add-room.component';
import { RoomService } from '../room.service';
import { DialogAddMultiRoomComponent } from '../dialog-add-multi-room/dialog-add-multi-room.component';

@Component({
  selector: 'app-add-floor',
  templateUrl: './add-floor.component.html',
  styleUrls: ['./add-floor.component.css']
})
export class AddFloorComponent {
  allBuilding: Building[] = [];
  selectedBuildingName: any;
  selectedFloors: Floor[] = [];
  @ViewChild(AddRoomComponent) addRoomComponent!: AddRoomComponent;


  constructor(public dialog: MatDialog, private roomService: RoomService) {

  }

  ngOnInit() {
    this.allBuilding = AppComponent.buildings
    if (this.allBuilding.length > 0) {
      this.selectedBuildingName = this.allBuilding[0];
      this.onBuildingChange(this.selectedBuildingName);
    }
    this.roomService.floorListUpdated$.subscribe(() => {
      console.log("هون لازم يعمل رفرش للفلور")
      this.testRef();
    });
  }

  testRef() {
    console.log("Enter Function testRef")
    this.allBuilding = AppComponent.buildings
    if (this.allBuilding.length > 0) {
      this.selectedBuildingName = this.allBuilding[0];
      this.onBuildingChange(this.selectedBuildingName);
    }
  }

  onBuildingChange(selectedBuilding: Building) {
    this.selectedFloors = selectedBuilding.floors || [];
  }

  getTotalRooms(buildingId: number, floorId: number): number {
    const building = this.allBuilding.find(b => b.id === buildingId);
    if (!building) {
      return 0;
    }
    const roomsInSuites = building.floors.filter(floor => floor.id === floorId).reduce((totalRooms, floor) => {
      return totalRooms + floor.suites.reduce((suiteRooms, suite) => {
        return suiteRooms + suite.rooms.length;
      }, 0);
    }, 0);
    const singleRooms = AppComponent.rooms.filter(room => room.building_id === buildingId && room.floor_id === floorId).length;
    return roomsInSuites + singleRooms;
  }

  openDialogEditOrAdd(buildingId: number, floorId: number | null, floorNumber: number) {
    if (buildingId !== 0 && floorId !== 0 && floorNumber !== 0) {
      const dialogRef = this.dialog.open(DialogEditAndAddFloorComponent, {
        data: { buildingId: buildingId, floorId: floorId, floorNumber: floorNumber }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    } else {
      const dialogRef = this.dialog.open(DialogEditAndAddFloorComponent);
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }
  }

  openDeleteDialog(id: number, buildingId: number, floorId: number, name: string): void {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      data: { id: id, buildingId: buildingId, floorId: floorId, name: name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Item deleted');
      } else {
        console.log('Deletion cancelled');
      }
    });
  }

  openAddMultiRoomDialog(buildingId: number, floorId: number): void {
    this.dialog.open(DialogAddMultiRoomComponent, {
      data: { buildingId: buildingId, floorId: floorId, }
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     console.log('Item deleted');
    //   } else {
    //     console.log('Deletion cancelled');
    //   }
    // });
  }
}
