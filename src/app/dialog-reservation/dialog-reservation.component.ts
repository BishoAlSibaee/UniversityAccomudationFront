import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiLinks } from '../ApiLinks';
import { AppComponent } from '../app.component';
import { LoadingDialogComponent } from '../loading-dialog/loading-dialog.component';
import { Student } from '../Student';
import { Reservation } from '../Reservation';

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

  constructor(private client: HttpClient, public dialogRef: MatDialogRef<DialogReservationComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog) {
    if (data) {
      console.log("roomId = " + data.roomId)
      console.log("roomNumber = " + data.roomNumber)
      console.log("startDate = " + data.startDate)
      console.log("endDate = " + data.endDate)
    }
  }

  checkVaule(): boolean {
    if (this.by === "name") {
      const isNumber = /^[0-9]+$/.test(this.value);
      if (isNumber) {
        this.openSnackBar("Invalid input: Name cannot contain numbers.", "Ok");
        return false;
      }
    } else if (this.by === "student_number") {
      const isText = /[a-zA-Z\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(this.value);
      if (isText) {
        this.openSnackBar("Invalid input: Only numbers are allowed.", "Ok");
        return false;
      }
    }
    return true;
  }

  serachStudentBy() {
    if (this.by === '') {
      return this.openSnackBar("Select Search Type", "Ok");
    }
    if (this.value === '') {
      return this.openSnackBar("Enter the search word", "Ok");
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
        console.log(result)
        if (result.code === 1) {
          AppComponent.students = result.user
          this.students = AppComponent.students
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

  addUserReservation() {
    if (this.selecteStudentName === '' || this.selecteStudentId === 0) {
      return this.openSnackBar('Select Student', 'Ok')
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
    };
    this.reservationsList.push(newReservation);
    this.dialogRef.close(this.reservationsList);
    console.log("reservationsList = " + this.reservationsList.length)

  }

  onTimeChange() {
    if (this.startTime) {
      const [startHours, startMinutes] = this.startTime.split(':').map(Number);
      const start = new Date();
      start.setHours(startHours, startMinutes, 0, 0);
      this.startTimestamp = start.getTime().toString();
      console.log("Start Time Timestamp:", this.startTimestamp);
    }

    if (this.expirTime) {
      const [expirHours, expirMinutes] = this.expirTime.split(':').map(Number);
      const expir = new Date();
      expir.setHours(expirHours, expirMinutes, 0, 0);
      this.expirTimestamp = expir.getTime().toString();
      console.log("Expiry Time Timestamp:", this.expirTimestamp);
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

  onStudentChange(s: Student) {
    this.selecteStudentName = s.name;
    this.selecteStudentId = s.id;
  }
}