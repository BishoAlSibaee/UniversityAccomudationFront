import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Student } from '../Student';
import { AppComponent } from '../app.component';
import { Building } from '../Building';
import { Floor } from '../Floor';
import { Suite } from '../Suite';
import { Room } from '../Room';
import { DialogMessageComponent } from '../dialog-message/dialog-message.component';
import { MatDialog } from '@angular/material/dialog';
import { LoadingDialogComponent } from '../loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-make-reservation',
  templateUrl: './make-reservation.component.html',
  styleUrls: ['./make-reservation.component.css']
})
export class MakeReservationComponent {

  searchName = ""
  LightColor = "#3d2706"
  student:Student
  searchStudents:Student[] = []
  message = ""
  searchStudent = AppComponent.AdminUrl + "searchStudentByName"
  getBuildingsUrl = AppComponent.AdminUrl + "getBuildings"
  getFloorsUrl = AppComponent.AdminUrl + "getFloors"
  getSuitesUrl = AppComponent.AdminUrl + "getSuites"
  getRoomsUrl = AppComponent.AdminUrl + "getRooms"
  makeReservationUrl = AppComponent.AdminUrl + "makeReservation"
  selectedBuilding:Building
  buildings:Building[] =[]
  selectedFloor:Floor|any
  floors:Floor[] = []
  floorsForSelect:Floor[] = []
  selectedSuite:Suite|any
  suites:Suite[] = []
  suitesForSelect:Suite[] = []
  selectedRoom:Room|any
  rooms:Room[] = []
  roomsForSelect:Room[] = []
  expirDate:any
  startDate:any

  constructor(
    private router:Router,
    private client:HttpClient,
    private dialog:MatDialog
  ) {
    this.student = new Student(0,"","","","","","","","")
    this.selectedBuilding = this.buildings[0]
  }

  ngOnInit() {
    this.getBuildings()
  }

  back() {
    this.router.navigate(['mainPage'])
  }

  search() {
    let params = new FormData()
    params.append("student_name", this.searchName)
    const h = new HttpHeaders({
      Authorization: `Bearer ${AppComponent.token}`,
    })
    let options = { headers: h }
    this.dialog.open(LoadingDialogComponent)
    this.client.post<any>(this.searchStudent,params,options).subscribe({next:(result)=>{
      this.dialog.closeAll()
      console.log(result)
      if (result.code == 1) {
        this.searchStudents = result.students
      }
    },error:(error)=>{
      this.dialog.closeAll()
      console.log(error)
      this.dialog.open(DialogMessageComponent, { data: { title: "خطأ", theMessage: "حدث خطأ \n "+error } })
    }})
  }

  getBuildings() {
    const h = new HttpHeaders({
      Authorization: `Bearer ${AppComponent.token}`,
    })
    let options = { headers: h }
    this.client.get<any>(this.getBuildingsUrl,options).subscribe({next:(result)=>{
      console.log(result)
      this.buildings = result
      this.getFloors()
    },error:(error)=>{
      console.log(error)
    }})
  }

  getFloors() {
    const h = new HttpHeaders({
      Authorization: `Bearer ${AppComponent.token}`,
    })
    let options = { headers: h }
    this.client.get<any>(this.getFloorsUrl,options).subscribe({next:(result)=>{
      console.log(result)
      this.floors = result
      this.getSuites()
    },error:(error)=>{
      console.log(error)
    }})
  }

  getSuites() {
    const h = new HttpHeaders({
      Authorization: `Bearer ${AppComponent.token}`,
    })
    let options = { headers: h }
    this.client.get<any>(this.getSuitesUrl,options).subscribe({next:(result)=>{
      console.log(result)
      this.suites = result
      this.getRooms()
    },error:(error)=>{
      console.log(error)
    }})
  }

  getRooms() {
    const h = new HttpHeaders({
      Authorization: `Bearer ${AppComponent.token}`,
    })
    let options = { headers: h }
    this.client.get<any>(this.getRoomsUrl,options).subscribe({next:(result)=>{
      console.log(result)
      this.rooms = result
    },error:(error)=>{
      console.log(error)
    }})
  }

  setFloors(bu:Building) {
    this.floorsForSelect = []
    for (let i=0;i<this.floors.length;i++) {
      if (this.floors[i].building_id == bu.id) {
        this.floorsForSelect.push(this.floors[i])
      }
    }
  }

  setSuites(fl:Floor) {
    this.suitesForSelect = []
    for (let i=0;i<this.suites.length;i++) {
      if (this.suites[i].building_id == fl.id) {
        this.suitesForSelect.push(this.suites[i])
      }
    }
  }

  setRooms(su:Suite) {
    this.roomsForSelect = []
    for (let i=0;i<this.rooms.length;i++) {
      if (this.rooms[i].building_id == su.id) {
        this.roomsForSelect.push(this.rooms[i])
      }
    }
  }

  saveReservation() {
    this.message = ""
    if (this.student.id == 0 || this.student == undefined) {
      if (this.searchStudents.length > 0) {
        this.message = "يرجى اختيار طالب "
      }
      else {
        this.message = "يرجى البحث عن الطالب"
      }
      return
    }
    if (this.selectedBuilding == null) {
      this.message = "يرجى اختيار المبنى"
      return
    }
    if (this.selectedFloor == null) {
      this.message = "يرجى اختيار الدور"
      return
    }
    if (this.selectedSuite == null) {
      this.message = "يرجى اختيار الجناح"
      return
    }
    if (this.selectedRoom == null) {
      this.message = "يرجى اختيار الغرفة"
      return
    }
    if (this.startDate == null) {
      this.message = "يرجى تحديد بداية الفترة"
      return
    }
    if (this.expirDate == null) {
      this.message = "يرجى تحديد نهاية الفترة"
      return
    }
    let StartDate = new Date(this.startDate)
    let ExpireDate = new Date(this.expirDate)
    let Start = StartDate.getFullYear() + "-" + (StartDate.getMonth() + 1) + "-" + StartDate.getDate()
    let Expire = ExpireDate.getFullYear() + "-" + (ExpireDate.getMonth() + 1) + "-" + ExpireDate.getDate()
    const h = new HttpHeaders({
      Authorization: `Bearer ${AppComponent.token}`,
    })
    let options = { headers: h }
    let params = new FormData()
    params.append("student_id", this.student.id.toString())
    params.append("room_id", this.selectedRoom.id)
    params.append("student_name", this.student.name)
    params.append("room_number", this.selectedRoom.number)
    params.append("start_date", Start)
    params.append("expire_date", Expire)

    this.client.post<any>(this.makeReservationUrl,params, options).subscribe({next:(result)=>{
      console.log(result)
      if (result.code == 1) {
        this.dialog.open(DialogMessageComponent, { data: { title: "تم الحفظ", theMessage: "تم حفظ الحجز بنجاح" } });
      }
      else {
        if (typeof result.error == "object") {
          this.message = AppComponent.handleError(result.error)
        }
        else {
          this.message = result.error
        }
      }
    },error:(error)=>{
      if (typeof error == "object") {
        this.message = AppComponent.handleError(error)
      }
      else {
        this.message = error
      }
    }}) 
  }

}
