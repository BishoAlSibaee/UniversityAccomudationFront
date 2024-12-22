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

@Component({
  selector: 'app-get-reservation-by-date',
  templateUrl: './get-reservation-by-date.component.html',
  styleUrls: ['./get-reservation-by-date.component.css']
})

export class GetReservationByDateComponent {
  private _snackBar = inject(MatSnackBar);
  selectedBuildingId: string = "";
  buildings: Building[] = [];
  reservation: Reservation[] = [];
  startDate: string = '';
  expirDate: string = '';
  selectedBuilding: Building | null = null;
  floor: Floor[] = []
  suite: Suite[] = []
  selectedFloor: Floor | 'all' | null = null;
  selectedSuite: Suite | 'all' | null = null;
  selectedRoom: Room | 'all' | null = null;
  allRoom: Room[] = [];
  filteredRooms: Room[] = [];
  roomInSuite: Room[] = [];

  constructor(private router: Router, private client: HttpClient, private dialog: MatDialog) { }

  ngOnInit() {
    this.buildings = AppComponent.buildings;
    this.allRoom = AppComponent.rooms;
    if (this.buildings.length === 0) {
      this.router.navigate(['/mainPage']);
    }
  }

  onBuildingChange(selectedBuilding: any) {
    if (selectedBuilding === 'all') {
      this.floor = [];
      this.filteredRooms = [];
      this.selectedFloor = 'all';
      this.selectedSuite = 'all';
      this.selectedRoom = 'all';
      this.selectedBuildingId = 'all'
    } else {
      this.selectedBuildingId = selectedBuilding.id
      this.floor = selectedBuilding.floors || [];
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
      this.suite = selectedFloor.suites || 'all'
      this.filterRooms();
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
      this.selectedBuilding.floors.forEach(floor => {
        if (this.selectedFloor === null || this.selectedFloor === 'all' || floor.id === (this.selectedFloor as Floor).id) {
          floor.suites.forEach(suite => {
            this.filteredRooms.push(...suite.rooms);
          });
        }
      });
      this.filteredRooms.sort((a, b) => a.number - b.number);
    }
  }

  onRoomChange(selectedRoom: any) {
    console.log("Selected Room = ", selectedRoom);
  }

  filterRooms() {
    this.filteredRooms = [];
    if (this.selectedBuilding) {
      if (this.selectedFloor === null || this.selectedFloor === 'all') {
        this.filteredRooms = this.allRoom.filter(room => room.building_id === this.selectedBuilding?.id);
      } else {
        this.filteredRooms = this.allRoom.filter(room =>
          room.building_id === this.selectedBuilding?.id &&
          room.floor_id === (this.selectedFloor as Floor).id
        );
      }

      this.selectedBuilding.floors.forEach(floor => {
        if (this.selectedFloor === null || this.selectedFloor === 'all' || floor.id === (this.selectedFloor as Floor).id) {
          floor.suites.forEach(suite => {
            this.filteredRooms.push(...suite.rooms);
          });
        }
      });
      this.filteredRooms.sort((a, b) => a.number - b.number);
    }
  }

  getReservation() {
    if (this.startDate === '' || this.expirDate === '') {
      return this.openSnackBar("Enter Date", "Ok");
    }
    if (this.selectedBuildingId === '' || this.selectedBuildingId == null) {
      return this.openSnackBar("Select Building", "Ok");
    }
    let StartDate = new Date(this.startDate)
    let ExpireDate = new Date(this.expirDate)
    let Start = StartDate.getFullYear() + "-" + (StartDate.getMonth() + 1) + "-" + StartDate.getDate()
    let Expire = ExpireDate.getFullYear() + "-" + (ExpireDate.getMonth() + 1) + "-" + ExpireDate.getDate()

    const dialogRef = this.dialog.open(LoadingDialogComponent, { disableClose: true });
    let params = new FormData();
    if (Start) params.append("start_date", Start);
    if (Expire) params.append("expire_date", Expire);

    if (this.selectedBuildingId !== 'all' && this.selectedBuildingId !== null) {
      params.append("building_id", this.selectedBuildingId);
    }
    if (this.selectedFloor !== 'all' && this.selectedFloor !== null) {
      params.append("floor_id", (this.selectedFloor as Floor).id.toString());
    }
    if (this.selectedSuite !== 'all' && this.selectedSuite !== null) {
      params.append("suite_id", (this.selectedSuite as Suite).id.toString());
    }
    if (this.selectedRoom !== 'all' && this.selectedRoom !== null) {
      params.append("room_id", (this.selectedRoom as Room).id.toString());
    }
    this.reservation = [];
    const token = localStorage.getItem("token")
    const h = new HttpHeaders({ Authorization: "Bearer " + token, });
    let options = { headers: h }
    this.client.post<any>(ApiLinks.getReservationByDate, params, options).subscribe({
      next: (result) => {
        if (result.code === 1) {
          console.log("Result = " + result)
          this.reservation = result.reservations
        } else {
          this.openSnackBar(result.error, "Ok");
        }
      }, error: (error) => {
        console.log(error)
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
      panelClass: ['dialog-panel']
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.table(result)
        console.log(result.id)
        console.log(result.student_name)
        const res = this.reservation.find(r => r.id === idReservation)
        console.table(result)
        if (res) {
          res.room_id = Number(result.room_id)
          res.room_number = result.room_number
          res.start_date = result.start_date
          res.expire_date = result.expire_date
          res.facility_ids = result.facility_ids
          console.log('result.id ' + result.room_id);
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

}
