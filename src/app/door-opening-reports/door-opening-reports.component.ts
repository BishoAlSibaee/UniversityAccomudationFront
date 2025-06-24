import { Component, inject } from '@angular/core';
import { translates } from '../translates';
import { Building } from '../Building';
import { Floor } from '../Floor';
import { Room } from '../Room';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiLinks } from '../ApiLinks';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OpeningRecord } from 'src/OpeningRecord';
import { LoadingDialogComponent } from '../loading-dialog/loading-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-door-opening-reports',
  templateUrl: './door-opening-reports.component.html',
  styleUrls: ['./door-opening-reports.component.css']
})
export class DoorOpeningReportsComponent {
  private _snackBar = inject(MatSnackBar);

  allRoom: Room[] = [];
  allBuilding: Building[] = [];
  selectedFloors: Floor[] = [];
  selectedBuilding: any;
  selectedFloor: any;
  selectedRoom: number = 0;
  filteredRooms: Room[] = [];
  openingRecords: OpeningRecord[] = [];

  constructor(private client: HttpClient, private router: Router, public dialog: MatDialog) {
    translates.create()
  }

  ngOnInit() {
    this.allBuilding = AppComponent.buildings;
    this.allRoom = AppComponent.rooms;
    if (this.allBuilding.length > 0) {
      this.selectedBuilding = this.allBuilding[0].id;
      this.selectedFloor = this.allBuilding[0].floors[0].id;
      this.onBuildingChange(this.selectedBuilding);
    } else {
      this.router.navigate(['/mainPage']);
    }
  }

  onBuildingChange(id: number) {
    const floor = this.allBuilding.find(b => b.id == id);
    this.selectedFloors = floor?.floors || [];
    this.onFloorChange(this.selectedFloors);
    this.filterRooms();
  }

  onFloorChange(selectedFloor: any) {
    this.selectedFloor = selectedFloor;
    this.filterRooms();
  }

  filterRooms() {
    this.filteredRooms = [];
    if (this.selectedBuilding) {
      this.filteredRooms = this.allRoom.filter(room => room.building_id == this.selectedBuilding && room.floor_id == this.selectedFloor);
      this.filteredRooms.sort((a, b) => a.number - b.number);
    }
  }

  onSelectRoom(idRoom: number) {
    console.log('ROOM ID = ' + idRoom);
  }

  getRecordOpeningDoor(roomId: number) {
    if (this.selectedRoom === 0) {
      return this.openSnackBar(this.getTranslate('ChooseRoom'), "Ok");
    }
    const dialogRef = this.dialog.open(LoadingDialogComponent, { disableClose: true });
    let params = new FormData();
    params.append("room_id", roomId.toString());

    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({ Authorization: "Bearer " + token });

    this.client.post<{ code: number; record: OpeningRecord[] }>(
      ApiLinks.getRecordOpeningDoor,
      params,
      { headers }
    ).subscribe({
      next: (result) => {
        if (result.code === 1) {
          this.openingRecords = [];
          this.openingRecords = result.record;
          if (this.openingRecords.length == 0) {
            this.openSnackBar(this.getTranslate('NoRecord'), "Ok");
          }
          dialogRef.close();
        } else {
          dialogRef.close();
          return this.openSnackBar(this.getTranslate('NoRecord'), "Ok");
        }
      },
      error: (error) => {
        this.openSnackBar(error, "Ok");
        dialogRef.close();
      },
    });
  }


  getTranslate(id: string) {
    return translates.getTranslate(id)
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 6000,
      panelClass: ['custom-snackbar']
    });
  }

}
