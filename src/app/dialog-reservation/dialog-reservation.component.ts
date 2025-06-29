import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiLinks } from '../ApiLinks';
import { AppComponent } from '../app.component';
import { LoadingDialogComponent } from '../loading-dialog/loading-dialog.component';
import { Student } from '../Student';
import { Reservation } from '../Reservation';
import { Facilitie } from '../Facilitie';
import { translates } from '../translates';

@Component({
  selector: 'app-dialog-reservation',
  templateUrl: './dialog-reservation.component.html',
  styleUrls: ['./dialog-reservation.component.css']
})

export class DialogReservationComponent {
  private _snackBar = inject(MatSnackBar);
  by: string = '';
  value: string = "";
  students: Student[] = [];
  reservationsList: Reservation[] = [];
  selecteStudentId: number = 0;
  selecteStudentName: string = "";
  startTimestamp: string = '';
  expirTimestamp: string = '';
  startTime: string = '';
  expirTime: string = '';
  facilities: Facilitie[] = []
  selectedFacilities: number[] = [];
  allSelected: boolean = false
  selectedId: number = 0;
  lang: string = ""

  constructor(private client: HttpClient, public dialogRef: MatDialogRef<DialogReservationComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog) {
    translates.create()
    this.lang = AppComponent.language;
    this.getFacilitieByRoom();
  }

  checkVaule(): boolean {
    if (this.by === "name") {
      const isNumber = /^[0-9]+$/.test(this.value);
      if (isNumber) {
        this.openSnackBar(this.getTranslate('OnlyName'), "Ok");
        return false;
      }
    } else if (this.by === "student_number") {
      const isText = /[a-zA-Z\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(this.value);
      if (isText) {
        this.openSnackBar(this.getTranslate('OnlyNumbers'), "Ok");
        return false;
      }
    }
    return true;
  }

  serachStudentBy() {
    if (this.by === '') {
      return this.openSnackBar(this.getTranslate('SelectSearch'), "Ok");
    }
    if (this.value === '') {
      return this.openSnackBar(this.getTranslate('Enter') + " " + this.getTranslate('SearchWord'), "Ok");
    }
    if (!this.checkVaule()) {
      return;
    }
    this.students = [];
    const dialogRef = this.dialog.open(LoadingDialogComponent, { disableClose: true });
    let params = new FormData();
    params.append("by", this.by);
    params.append("value", this.value);
    const token = localStorage.getItem("token")
    const h = new HttpHeaders({ Authorization: "Bearer " + token, });
    let options = { headers: h }
    this.client.post<any>(ApiLinks.serachStudentBy, params, options).subscribe({
      next: (result) => {
        if (result.code === 1) {
          AppComponent.students = result.user
          this.students = AppComponent.students
        } else {
          return this.openSnackBar(result.error, "Ok");
        }
      }, error: (error) => {
        return this.openSnackBar(error, "Ok");
      },
      complete: () => {
        dialogRef.close();
      }
    })
  }

  getFacilitieByRoom() {
    this.facilities = [];
    const dialogRef = this.dialog.open(LoadingDialogComponent, { disableClose: true });
    let params = new FormData();
    params.append("building_id", this.data.building_id);
    params.append("floor_id", this.data.floor_id);
    params.append("suite_id", this.data.suite_id);
    const token = localStorage.getItem("token")
    const h = new HttpHeaders({ Authorization: "Bearer " + token, });
    let options = { headers: h }
    this.client.post<any>(ApiLinks.getFacilitieByRoom, params, options).subscribe({
      next: (result) => {
        if (result.code === 1) {
          AppComponent.facilitie = result.facilities
          this.facilities = AppComponent.facilitie
        } else {
          return this.openSnackBar(result.error, "Ok");
        }
      }, error: (error) => {
        console.log(error)
        return this.openSnackBar(error, "Ok");
      },
      complete: () => {
        dialogRef.close();
      }
    })
  }

  toggleFacility(facilitieId: number) {
    const index = this.selectedFacilities.indexOf(facilitieId);
    if (index > -1) {
      this.selectedFacilities.splice(index, 1);
      if (this.allSelected) {
        this.allSelected = false
      }
    } else {
      this.selectedFacilities.push(facilitieId);
      if (this.selectedFacilities.length == this.facilities.length) {
        if (!this.allSelected) {
          this.allSelected = true
        }
      }
    }
  }

  toggleSelectAll() {
    if (this.allSelected) {
      this.selectedFacilities = this.facilities.map(f => f.id);
    } else {
      this.selectedFacilities = [];
    }
  }

  addUserReservation() {
    if (this.selecteStudentName === '' || this.selecteStudentId === 0) {
      return this.openSnackBar(this.getTranslate('SelectGuest'), 'Ok')
    }
    const newReservation = {
      id: 0,
      student_id: this.selecteStudentId,
      room_id: this.data.roomId,
      student_name: this.selecteStudentName,
      room_number: this.data.roomNumber,
      start_date: this.data.startDate,
      expire_date: this.data.endDate,
      start_time: this.startTimestamp,
      expire_time: this.expirTimestamp,
      facility_ids: [...this.selectedFacilities],
      is_available: 0
    };
    this.reservationsList.push(newReservation);
    this.dialogRef.close(this.reservationsList);
    this.selectedFacilities = []
  }

  onTimeChange() {
    if (this.startTime) {
      const [startHours, startMinutes] = this.startTime.split(':').map(Number);
      const start = new Date();
      start.setHours(startHours, startMinutes, 0, 0);
      this.startTimestamp = start.getTime().toString();
    }

    if (this.expirTime) {
      const [expirHours, expirMinutes] = this.expirTime.split(':').map(Number);
      const expir = new Date();
      expir.setHours(expirHours, expirMinutes, 0, 0);
      this.expirTimestamp = expir.getTime().toString();
    }
  }

  cancelDialog() {
    this.dialogRef.close();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 6000,
      panelClass: ['custom-snackbar']
    });
  }

  onStudentChange(id: number) {
    const person = this.students.find(s => s.id == id);
    if (person) {
      this.selecteStudentName = person.name;
      this.selecteStudentId = person.id;
    }
  }

  getTranslate(id: string) {
    return translates.getTranslate(id)
  }
}
