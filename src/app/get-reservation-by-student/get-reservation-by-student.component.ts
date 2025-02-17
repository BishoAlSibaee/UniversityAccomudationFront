import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiLinks } from '../ApiLinks';
import { LoadingDialogComponent } from '../loading-dialog/loading-dialog.component';
import { Reservation } from '../Reservation';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';
import { AppComponent } from '../app.component';
import { UpdateReservationComponent } from '../update-reservation/update-reservation.component';
import { translates } from '../translates';

@Component({
  selector: 'app-get-reservation-by-student',
  templateUrl: './get-reservation-by-student.component.html',
  styleUrls: ['./get-reservation-by-student.component.css']
})
export class GetReservationByStudentComponent {
  private _snackBar = inject(MatSnackBar);
  startDate: string = '';
  expirDate: string = '';
  by: string = '';
  value: string = '';
  reservation: Reservation[] = [];

  constructor(private client: HttpClient, private dialog: MatDialog) {
    translates.create()
  }

  getReservation() {
    if (this.by === '') {
      return this.openSnackBar(this.getTranslate('SelectSearch'), "Ok");
    }
    if (this.value === '') {
      return this.openSnackBar(this.getTranslate('Enter') + " " + this.getTranslate('SearchWord'), "Ok");
    }
    this.reservation = [];
    const dialogRef = this.dialog.open(LoadingDialogComponent, { disableClose: true });
    let params = new FormData()
    if (this.startDate != '' && this.expirDate != '') {
      let StartDate = new Date(this.startDate)
      let ExpireDate = new Date(this.expirDate)
      let Start = StartDate.getFullYear() + "-" + (StartDate.getMonth() + 1) + "-" + StartDate.getDate()
      let Expire = ExpireDate.getFullYear() + "-" + (ExpireDate.getMonth() + 1) + "-" + ExpireDate.getDate()
      params.append("start_date", Start);
      params.append("expire_date", Expire);
    }
    params.append("type", this.by);
    params.append("word", this.value);
    const token = localStorage.getItem("token")
    const h = new HttpHeaders({ Authorization: "Bearer " + token, });
    let options = { headers: h }
    this.client.post<any>(ApiLinks.getReservationByStudent, params, options).subscribe({
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

  openUpdateReservationDialog(idReservation: number, nameUser: string, room_id: number, room_number: string, start_date: string, expire_date: string, facility_ids: any, buildingName: string): void {
    const dialogRef = this.dialog.open(UpdateReservationComponent, {
      data: { idReservation: idReservation, nameUser: nameUser, room_id: room_id, room_number: room_number, start_date: start_date, expire_date: expire_date, facility_ids: facility_ids, buildingName: buildingName },
      panelClass: ['dialog-panel']
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

  getBuildingNameByIdRoom(roomId: number): string {
    const independentRoom = AppComponent.rooms.find(room => room.id === roomId);
    if (independentRoom) {
      const building = AppComponent.buildings.find(b => b.id === independentRoom.building_id);
      return building ? building.name : 'Unknown';
    }
    for (const building of AppComponent.buildings) {
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
