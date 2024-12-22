import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiLinks } from '../ApiLinks';
import { AppComponent } from '../app.component';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';
import { DialogEditAndAddStudentComponent } from '../dialog-edit-and-add-student/dialog-edit-and-add-student.component';
import { LoadingDialogComponent } from '../loading-dialog/loading-dialog.component';
import { Student } from '../Student';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { College } from '../College';

@Component({
  selector: 'app-search-student',
  templateUrl: './search-student.component.html',
  styleUrls: ['./search-student.component.css'],
})
export class SearchStudentComponent {
  private _snackBar = inject(MatSnackBar);
  students: Student[] = []
  value: string = ""
  by: string = ''
  listCollege: College[] = []
  showList: boolean = false
  selectedCollegeId: number = 0
  checkedCollege: boolean = false

  constructor(private client: HttpClient, public dialog: MatDialog, private userService: UserService) { }

  ngOnInit() {
    this.userService.studentUpdated$.subscribe(() => {
      this.students = AppComponent.students
    });
  }

  checkVaule(): boolean {
    if (this.by === "name") {
      const isNumber = /^[0-9]+$/.test(this.value);
      if (isNumber) {
        this.openSnackBar("Invalid input: Name cannot contain numbers.", "Ok");
        return false;
      }
    } else if (this.by === "student_number" || this.by === "mobile") {
      const isText = /[a-zA-Z\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(this.value);
      if (isText) {
        this.openSnackBar("Invalid input: Only numbers are allowed.", "Ok");
        return false;
      }
    }
    return true;
  }

  isChecked() {
    if (this.checkedCollege) {
      this.listCollege = AppComponent.college
      this.showList = true

    } else {
      this.listCollege = []
      this.selectedCollegeId = 0
      this.showList = false
    }
  }

  serachStudentBy() {
    if (this.by === '') {
      return this.openSnackBar("Select Search Type", "Ok");
    }
    if (this.value === '') {
      return this.openSnackBar("Enter the search word", "Ok");
    }
    this.students = []
    if (!this.checkVaule()) {
      return;
    }
    if (this.by === '') {
      return this.openSnackBar("Enter Select Search Type", "Ok");
    }
    if (this.checkedCollege) {
      if (this.selectedCollegeId === 0) {
        return this.openSnackBar("Select College", "Ok");
      }
    }
    const dialogRef = this.dialog.open(LoadingDialogComponent, { disableClose: true });
    let params = new FormData();
    params.append("by", this.by);
    params.append("value", this.value);
    if (this.selectedCollegeId !== 0) {
      params.append("college_id", this.selectedCollegeId.toString());
    }
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
        console.log(error)
        return this.openSnackBar(error, "Ok");
      },
      complete: () => {
        dialogRef.close();
      }
    })
  }

  getStudents() {
    const dialogRef = this.dialog.open(LoadingDialogComponent, { disableClose: true });

    const token = localStorage.getItem("token")
    const h = new HttpHeaders({ Authorization: "Bearer " + token, });
    let options = { headers: h }
    this.client.get<Student[]>(ApiLinks.getAllStudents, options).subscribe({
      next: (result) => {
        console.log("Result = " + result)
        AppComponent.students = result
        this.students = AppComponent.students
      }, error: (error) => {
        console.log(error)
      },
      complete: () => {
        dialogRef.close();
      }
    })
  }

  openDialogEditOrAdd(studentId: number, studentName: string, studentMobile: string, student_number: string, action: string) {
    if (studentId !== 0 && studentName !== "" && studentMobile !== "" && student_number !== "") {
      this.dialog.open(DialogEditAndAddStudentComponent, {
        data: { studentId: studentId, studentName: studentName, studentMobile: studentMobile, student_number: student_number, action: action }
      });
    } else {
      this.dialog.open(DialogEditAndAddStudentComponent);
    }
  }

  openDeleteDialog(id: number, name: string): void {
    this.dialog.open(DialogDeleteComponent, { data: { id: id, name: name } });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 6000,
      panelClass: ['custom-snackbar']
    });
  }

}
