import { Component } from '@angular/core';
import { Student } from '../Student';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppComponent } from '../app.component';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent {

  students: Student[] = []
  getStudentsUrl = AppComponent.AdminUrl + "getAllStudents"
  LightColor = "#3d2706"


  constructor(
    private client: HttpClient,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.getStudents()
  }

  pageChangeEvent() {

  }

  back() {
    this.router.navigate(['mainPage'])
  }

  getStudents() {
    const h = new HttpHeaders({
      Authorization: `Bearer`,
    })
    let options = { headers: h }
    this.client.get<Student[]>(this.getStudentsUrl, options).subscribe({
      next: (result) => {
        console.log(result)
        this.students = result
      }, error: (error) => {
        console.log(error)
      }
    })
  }

}
