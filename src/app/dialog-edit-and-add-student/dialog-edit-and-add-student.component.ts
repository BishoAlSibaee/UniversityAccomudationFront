import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiLinks } from '../ApiLinks';
import { AppComponent } from '../app.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Student } from '../Student';
import { UserService } from '../user.service';

@Component({
  selector: 'app-dialog-edit-and-add-student',
  templateUrl: './dialog-edit-and-add-student.component.html',
  styleUrls: ['./dialog-edit-and-add-student.component.css']
})
export class DialogEditAndAddStudentComponent {

  private _snackBar = inject(MatSnackBar);
  studentName: string = ""
  studentNumber: string = ""
  studentMobile: string = ""
  nameBtn: string = "Add"
  title: string = "Add Student"

  constructor(private client: HttpClient, public dialogRef: MatDialogRef<DialogEditAndAddStudentComponent>, private userService: UserService, @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) {
      this.studentName = data.studentName;
      this.studentNumber = data.student_number;
      this.studentMobile = data.studentMobile;
      this.nameBtn = data.action;
      this.title = "Update Student"
    }
  }

  onClickCancel() {
    this.dialogRef.close();
  }

  onClickOk() {
    if (this.nameBtn === 'Add') {
      this.addStudent();
    }
    if (this.nameBtn === 'Update') {
      this.updateStudent()
    }
  }

  addStudent() {
    if (this.studentName === "" || this.studentNumber === "" || this.studentMobile === "") {
      return this.openSnackBar("All Required", "Ok");
    }
    let params = new FormData();
    params.append("name", this.studentName);
    params.append("student_number", this.studentNumber);
    params.append("mobile", this.studentMobile);
    const token = localStorage.getItem("token")
    const h = new HttpHeaders({
      Authorization: "Bearer " + token,
    });
    let options = { headers: h };
    this.client.post<any>(ApiLinks.createStudent, params, options).subscribe({
      next: (result) => {
        console.log(result)
        if (result.code === 1) {
          const newStudent = new Student(result.user.id, result.user.name, "", result.user.mobile, result.user.student_number, "", "")
          AppComponent.students.push(newStudent)
          this.userService.refreshStudentList();
          this.dialogRef.close()
          return this.openSnackBar("Add Done", "Ok");
        } else {
          if (result.error.mobile != null) {
            return this.openSnackBar(result.error.mobile, "Ok");
          }
          return this.openSnackBar(result.error.errorInfo, "Ok");
        }
      },
      error: (error) => {
        console.log("RESULT = " + error)
        console.log("Error");
        console.log(error);
      }
    });
  }

  updateStudent() {
    if (this.studentName === "" || this.studentNumber === "" || this.studentMobile === "") {
      return this.openSnackBar("All Required", "Ok");
    }
    let params = new FormData();
    params.append("id", this.data.studentId);
    params.append("name", this.studentName);
    params.append("student_number", this.studentNumber);
    params.append("mobile", this.studentMobile);
    const token = localStorage.getItem("token")
    const h = new HttpHeaders({
      Authorization: "Bearer " + token,
    });
    let options = { headers: h };
    this.client.post<any>(ApiLinks.updateInfoStudent, params, options).subscribe({
      next: (result) => {
        console.log(result)
        if (result.code === 1) {
          const student = AppComponent.students.find(s => s.id === this.data.studentId);
          if (student) {
            student.name = result.user.name;
            student.mobile = result.user.mobile;
            student.student_number = result.user.student_number;
          }
          this.userService.refreshStudentList();
          this.dialogRef.close()
          return this.openSnackBar("Add Done", "Ok");
        } else {
          if (result.error.mobile != null) {
            return this.openSnackBar(result.error.mobile, "Ok");
          }
          if (result.error.student_number != null) {
            return this.openSnackBar(result.error.student_number, "Ok");
          }
        }
      },
      error: (error) => {
        console.log("RESULT = " + error)
        console.log("Error");
        console.log(error);
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 6000,
      panelClass: ['custom-snackbar']
    });
  }
}
