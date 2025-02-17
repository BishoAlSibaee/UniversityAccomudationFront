import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiLinks } from '../ApiLinks';
import { AppComponent } from '../app.component';
import { Building } from '../Building';
import { LoadingDialogComponent } from '../loading-dialog/loading-dialog.component';
import { Reservation } from '../Reservation';
import { Floor } from '../Floor';
import { Room } from '../Room';
import { Suite } from '../Suite';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';
import { UpdateReservationComponent } from '../update-reservation/update-reservation.component';
import { translates } from '../translates';

@Component({
  selector: 'app-get-reservation-by-date',
  templateUrl: './get-reservation-by-date.component.html',
  styleUrls: ['./get-reservation-by-date.component.css']
})

export class GetReservationByDateComponent {
  private _snackBar = inject(MatSnackBar);
  buildings: Building[] = [];
  reservation: Reservation[] = [];
  startDate: string = '';
  expirDate: string = '';
  selectedBuilding: Building | 'all' | null = null;
  floor: Floor[] = []
  suite: Suite[] = []
  selectedFloor: Floor | 'all' | null = null;
  selectedSuite: Suite | 'all' | null = null;
  selectedRoom: Room | 'all' | null = null;
  allRoom: Room[] = [];
  filteredRooms: Room[] = [];
  roomInSuite: Room[] = [];

  constructor(private router: Router, private client: HttpClient, private dialog: MatDialog) {
    translates.create()
  }

  ngOnInit() {
    this.buildings = AppComponent.buildings;
    this.allRoom = AppComponent.rooms;
    if (this.buildings.length === 0) {
      this.router.navigate(['/mainPage']);
    }
    this.selectedFloor = 'all';
    this.selectedSuite = 'all';
    this.selectedRoom = 'all';
    this.selectedBuilding = 'all'
  }

  onBuildingChange(selectedBuilding: any) {
    if (selectedBuilding === 'all') {
      this.floor = [];
      this.filteredRooms = [];
      this.selectedFloor = 'all';
      this.selectedSuite = 'all';
      this.selectedRoom = 'all';
      this.selectedBuilding = 'all'
    } else {
      this.selectedBuilding = selectedBuilding
      const f = this.buildings.find(b => b.id == selectedBuilding)
      this.floor = f?.floors || [];
      this.selectedFloor = 'all';
      this.selectedSuite = 'all';
      this.selectedRoom = 'all';
    }
  }

  onFloorChange(selectedFloor: any) {
    if (selectedFloor === 'all') {
      this.selectedSuite = 'all';
      this.selectedRoom = 'all';
      this.suite = []
      this.filteredRooms = [];
    } else {
      const suite = this.floor.find(f => f.id == selectedFloor)
      this.suite = suite?.suites || [];
      this.filterRooms();
    }
  }

  filterRooms() {
    this.filteredRooms = [];
    if (this.selectedBuilding) {
      if (this.selectedFloor === null || this.selectedFloor === 'all') {
        this.filteredRooms = this.allRoom.filter(room => room.building_id === Number(this.selectedBuilding));
      } else {
        this.filteredRooms = this.allRoom.filter(room =>
          room.building_id === Number(this.selectedBuilding) &&
          room.floor_id === Number(this.selectedFloor)
        );
      }
      const building = this.buildings.find(b => b.id === Number(this.selectedBuilding))
      if (building) {
        building.floors.forEach(floor => {
          if (this.selectedFloor === null || this.selectedFloor === 'all' || floor.id === (this.selectedFloor as Floor).id) {
            floor.suites.forEach(suite => {
              this.filteredRooms.push(...suite.rooms);
            });
          }
        });

      }
      this.filteredRooms.sort((a, b) => a.number - b.number);
    }
  }

  onSuiteChange(selectedSuite: any) {
    if (selectedSuite !== 'all') {
      this.filterRoomsInSuite();
    } else {
      this.filterRooms()
    }
  }

  filterRoomsInSuite() {
    this.filteredRooms = [];
    if (this.selectedBuilding) {
      const building = this.buildings.find(b => b.id === Number(this.selectedBuilding))
      if (building) {
        building.floors.forEach(floor => {
          if (this.selectedFloor === null || this.selectedFloor === 'all' || floor.id === Number(this.selectedFloor)) {
            floor.suites.forEach(suite => {
              this.filteredRooms.push(...suite.rooms);
            });
          }
        });
      }
      this.filteredRooms.sort((a, b) => a.number - b.number);
    }
  }

  onRoomChange(selectedRoom: any) {
    console.log("Selected Room = ", selectedRoom);
  }

  getReservation() {
    if (this.startDate === '' || this.expirDate === '') {
      return this.openSnackBar(this.getTranslate('EnterDate'), "Ok");
    }
    let StartDate = new Date(this.startDate)
    let ExpireDate = new Date(this.expirDate)
    let Start = StartDate.getFullYear() + "-" + (StartDate.getMonth() + 1) + "-" + StartDate.getDate()
    let Expire = ExpireDate.getFullYear() + "-" + (ExpireDate.getMonth() + 1) + "-" + ExpireDate.getDate()

    const dialogRef = this.dialog.open(LoadingDialogComponent, { disableClose: true });
    let params = new FormData();
    if (Start) params.append("start_date", Start);
    if (Expire) params.append("expire_date", Expire);

    if (this.selectedBuilding !== 'all' && this.selectedBuilding !== null) {
      params.append("building_id", (this.selectedBuilding).toString());
    }
    if (this.selectedFloor !== 'all' && this.selectedFloor !== null) {
      params.append("floor_id", (this.selectedFloor).toString());
    }
    if (this.selectedSuite !== 'all' && this.selectedSuite !== null) {
      params.append("suite_id", (this.selectedSuite).toString());
    }
    if (this.selectedRoom !== 'all' && this.selectedRoom !== null) {
      params.append("room_id", (this.selectedRoom).toString());
    }
    this.reservation = [];
    const token = localStorage.getItem("token")
    const h = new HttpHeaders({ Authorization: "Bearer " + token, });
    let options = { headers: h }
    this.client.post<any>(ApiLinks.getReservationByDate, params, options).subscribe({
      next: (result) => {
        if (result.code === 1) {
          this.reservation = result.reservations
        } else {
          this.openSnackBar(result.error, "Ok");
        }
      }, error: (error) => {
        this.openSnackBar(error, "Ok");
      },
      complete: () => {
        dialogRef.close();
      }
    })
  }

  openDeleteDialog(id: number, name: string): void {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      data: { id: id, name: name }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'ok') {
        const reservationIndex = this.reservation.findIndex(r => r.id === id);
        if (reservationIndex != -1) {
          this.reservation.splice(reservationIndex, 1)
        }
      } else {
        console.log('Deletion cancelled');
      }
    });
  }

  openUpdateReservationDialog(idReservation: number, nameUser: string, room_id: number, room_number: string, start_date: string, expire_date: string, facility_ids: any, buildingName: string): void {
    const dialogRef = this.dialog.open(UpdateReservationComponent, {
      data: { idReservation: idReservation, nameUser: nameUser, room_id: room_id, room_number: room_number, start_date: start_date, expire_date: expire_date, facility_ids: facility_ids, buildingName: buildingName },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const res = this.reservation.find(r => r.id === idReservation)
        if (res) {
          res.room_id = Number(result.room_id)
          res.room_number = result.room_number
          res.start_date = result.start_date
          res.expire_date = result.expire_date
          res.facility_ids = result.facility_ids
        }
      }
    });
  }

  getBuildingNameByIdRoom(roomId: number): string {
    const independentRoom = this.allRoom.find(room => room.id === roomId);
    if (independentRoom) {
      const building = this.buildings.find(b => b.id === independentRoom.building_id);
      return building ? building.name : 'Unknown';
    }
    for (const building of this.buildings) {
      for (const floor of building.floors) {
        for (const suite of floor.suites) {
          const suiteRoom = suite.rooms.find(room => room.id === roomId);
          if (suiteRoom) {
            return building.name;
          }
        }
      }
    }
    return 'Unknown';
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 6000,
      panelClass: ['custom-snackbar']
    });
  }

  getTranslate(id: string) {
    return translates.getTranslate(id)
  }
}



// Blocked aria-hidden on an element because its descendant retained focus. The focus must not be hidden from assistive technology users. Avoid using aria-hidden on a focused element or its ancestor. Consider using the inert attribute instead, which will also prevent focus. For more details, see the aria-hidden section of the WAI-ARIA specification at https://w3c.github.io/aria/#aria-hidden.
// Element with focus: button
// Ancestor with aria-hidden:
