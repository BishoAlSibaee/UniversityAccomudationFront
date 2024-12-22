import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Student } from '../Student';
import { AppComponent } from '../app.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiLinks } from '../ApiLinks';
import { countries } from 'countries-list';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { College } from '../College';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})

export class AddStudentComponent {
  private _snackBar = inject(MatSnackBar);
  student: Student
  countryList: string[] = [];
  myControl = new FormControl('');
  filteredOptions: Observable<string[]> | undefined;
  listCollege: College[] = []
  name: string = ''

  constructor(private router: Router, private client: HttpClient, private dialog: MatDialog) {
    this.student = new Student(0, "", "", "", "", "", "")
    this.myControl.valueChanges.subscribe(value => {
      this.student.nationality = value || '';
    });
  }

  ngOnInit() {
    this.getAllCollege()
    this.countryList = Object.values(countries).map(country => country.name);
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.countryList.filter(option => option.toLowerCase().includes(filterValue));
  }

  back() {
    this.router.navigate(['mainPage'])
  }

  getAllCollege() {
    const token = localStorage.getItem("token")
    const h = new HttpHeaders({
      Authorization: "Bearer " + token,
    });
    let options = { headers: h };
    this.client.get<College[]>(ApiLinks.getAllCollege, options).subscribe({
      next: (result) => {
        AppComponent.college = result
        this.listCollege = AppComponent.college
      },
      error: (error) => {
        console.log("Error");
        console.log(error);
      },
    });
  }

  addStudent() {
    console.log(this.student.name)
    if (this.student.name == "") {
      return this.openSnackBar("Enter Student Name", "Ok");
    }
    if (this.student.student_number == "") {
      return this.openSnackBar("Enter Student Number", "Ok");
    }
    if (this.student.mobile == "") {
      return this.openSnackBar("Enter Student Mobile", "Ok");
    }
    let params = new FormData();
    params.append("email", this.student.email)
    params.append("name", this.student.name)
    params.append("mobile", this.student.mobile)
    params.append("student_number", this.student.student_number)
    params.append("nationality", this.student.nationality)
    params.append("college_id", this.student.college)
    const token = localStorage.getItem("token")
    const h = new HttpHeaders({ Authorization: "Bearer " + token, });
    let options = { headers: h };
    this.client.post<any>(ApiLinks.createStudent, params, options).subscribe({
      next: (result) => {
        console.log(result)
        if (result.code === 1) {
          const newStudent = new Student(result.user.id, result.user.name, "", result.user.mobile, result.user.student_number, "", "")
          AppComponent.students.push(newStudent)
          this.student = new Student(0, "", "", "", "", "", "")
          return this.openSnackBar("Add Done", "Ok");

        } else {
          if (result.error.mobile != null) {
            return this.openSnackBar(result.error.mobile, "Ok");
          }
          if (result.error.email != null) {
            return this.openSnackBar(result.error.email, "Ok");
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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 6000,
      panelClass: ['custom-snackbar']
    });
  }

}
