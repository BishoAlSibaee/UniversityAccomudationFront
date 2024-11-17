import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Student } from '../Student';
import { ApiLinks } from '../ApiLinks';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditAndAddStudentComponent } from '../dialog-edit-and-add-student/dialog-edit-and-add-student.component';
import { AppComponent } from '../app.component';
import { UserService } from '../user.service';
import { LoadingDialogComponent } from '../loading-dialog/loading-dialog.component';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';

@Component({
  selector: 'app-student-management',
  templateUrl: './student-management.component.html',
  styleUrls: ['./student-management.component.css']
})
export class StudentManagementComponent {
  students: Student[] = []

  constructor(private client: HttpClient, public dialog: MatDialog, private userService: UserService) { }

  ngOnInit() {
    // this.getStudents();
    this.userService.studentUpdated$.subscribe(() => {
      this.students = AppComponent.students
    });
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
}
