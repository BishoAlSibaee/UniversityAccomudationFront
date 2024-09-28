import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {

  LightColor = "#3d2706"
  studentsVisible
  roomsVisible

  constructor(
    private router:Router
  ) {
    this.studentsVisible = true
    this.roomsVisible = false
  }

  ngOnInit() {

  }

  students() {
    this.studentsVisible = true
    this.roomsVisible = false
  }

  rooms() {
    this.studentsVisible = false
    this.roomsVisible = true
  }

  goToAddStudent() {
    this.router.navigate(['addStudent'])
  }

  goToShowStudents() {
    this.router.navigate(['students'])
  }

  goToMakeReservation() {
    this.router.navigate(['makeReservation'])
  }

}
