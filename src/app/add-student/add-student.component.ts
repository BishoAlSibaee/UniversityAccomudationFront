import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Student } from '../Student';
import { AppComponent } from '../app.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DialogMessageComponent } from '../dialog-message/dialog-message.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent {


  LightColor = "#3d2706"
  student: Student
  addStudentUrl = AppComponent.AdminUrl + "createStudent"
  message = ""

  constructor(
    private router: Router,
    private client: HttpClient,
    private dialog: MatDialog
  ) {
    this.student = new Student(0, "", "", "", "", "", "", "", "")
  }

  ngOnInit() {

  }

  back() {
    this.router.navigate(['mainPage'])
  }

  async addStudent() {
    this.message = ""
    if (this.student.name == "") {
      this.message = "ادخل اسم الطالب"
      return
    }
    if (this.student.student_number == "") {
      this.message = "ادخل الرقم الطلابي للطالب"
      return
    }
    if (this.student.mobile == "") {
      this.message = "ادخل رقم جوال الطالب"
      return
    }
    let params = new FormData()
    params.append("email", this.student.email)
    params.append("name", this.student.name)
    params.append("mobile", this.student.mobile)
    params.append("student_number", this.student.student_number)
    params.append("nationality", this.student.nationality)
    params.append("college", this.student.college)
    params.append("study_year", this.student.study_year)
    params.append("term", this.student.term)

    const h = new HttpHeaders({
      Authorization: `Bearer`,
    })
    let options = { headers: h }

    this.client.post<any>(this.addStudentUrl, params, options).subscribe({
      next: (result) => {
        console.log(result)
        if (result.code == 1) {
          this.student = new Student(0, "", "", "", "", "", "", "", "")
          this.dialog.open(DialogMessageComponent, { data: { title: "تم الحفظ", theMessage: "تم حفظ الطالب بنجاح" } })
        }
        else {
          if (typeof result.error == "object") {
            this.message = AppComponent.handleError(result.error)
          }
          else {
            this.message = result.error
          }
        }
      }, error: (error) => {
        console.log(error)
        if (typeof error == "object") {
          if (error.email != null) {
            this.message = this.message + " " + error.email
          }
          if (error.name != null) {
            this.message = this.message + " " + error.name
          }
          if (error.mobile != null) {
            this.message = this.message + " " + error.mobile
          }
          if (error.student_number != null) {
            this.message = this.message + " " + error.student_number
          }
          if (error.nationality != null) {
            this.message = this.message + " " + error.nationality
          }
          if (error.college != null) {
            this.message = this.message + " " + error.college
          }
          if (error.study_year != null) {
            this.message = this.message + " " + error.study_year
          }
          if (error.term != null) {
            this.message = this.message + " " + error.term
          }
          if (error.error != null) {
            this.message = this.message + " " + error.error.message
          }
        }
        else {
          this.message = error
        }
      }
    })
  }

}
