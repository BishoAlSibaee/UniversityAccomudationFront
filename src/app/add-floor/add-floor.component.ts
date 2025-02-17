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
import { translates } from '../translates';

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
    translates.create()
  }

  ngOnInit() {
    this.allBuilding = AppComponent.buildings
    if (this.allBuilding.length > 0) {
      this.selectedBuildingName = this.allBuilding[0].id;
      console.table(this.selectedBuildingName);
      this.onBuildingChange(this.selectedBuildingName);
    }
    this.roomService.floorListUpdated$.subscribe(() => {
      this.testRef();
    });
  }

  testRef() {
    console.log('Enter Done');
    this.allBuilding = AppComponent.buildings
    if (this.allBuilding.length > 0) {
      this.selectedBuildingName = this.allBuilding[0].id;
      this.onBuildingChange(this.selectedBuildingName);
    }
  }

  onBuildingChange(id: number) {
    // console.table(id);
    const floor = this.allBuilding.find(b => b.id == id);
    this.selectedFloors = floor?.floors || [];
  }


  getTotalRooms(buildingId: number, floorId: number): number {
    // const building = this.allBuilding.find(b => b.id == buildingId);
    // if (!building) {
    //   return 0;
    // }
    const singleRooms = AppComponent.rooms.filter(room => room.building_id == buildingId && room.floor_id == floorId).length;
    return singleRooms;
  }

  getNameBuilding(buildingId: number) {
    const building = this.allBuilding.find(b => b.id == buildingId);
    return building?.name;
  }

  openDialogEditOrAdd(buildingId: number, floorId: number | null, floorNumber: number) {
    if (buildingId !== 0 && floorId !== 0 && floorNumber !== 0) {
      this.dialog.open(DialogEditAndAddFloorComponent, {
        data: { buildingId: buildingId, floorId: floorId, floorNumber: floorNumber },
      });
      console.log('buildingId ' + buildingId)
      console.log('floorId ' + floorId)
      console.log('floorNumber ' + floorNumber)

    } else {
      this.dialog.open(DialogEditAndAddFloorComponent);
    }
  }

  openDeleteDialog(id: number, buildingId: number, floorId: number, name: string): void {
    this.dialog.open(DialogDeleteComponent, {
      data: { id: id, buildingId: buildingId, floorId: floorId, name: name },
    });
  }

  openAddMultiRoomDialog(buildingId: number, floorId: number): void {
    this.dialog.open(DialogAddMultiRoomComponent, {
      data: { buildingId: buildingId, floorId: floorId, },
    });
  }

  getTranslate(id: string) {
    return translates.getTranslate(id)
  }
}
