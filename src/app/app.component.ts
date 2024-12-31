import { Component } from '@angular/core';
import { Building } from './Building';
import { Room } from './Room';
import { Admin } from './Admin';
import { Student } from './Student';
import { College } from './College';
import { RoomType } from './RoomType';
import { Facilitie } from './Facilitie';
import { Reservation } from './Reservation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'QassimUniversity';
  public static MainUrl = "https://qu.ratco-solutions.com/api/"
  public static AdminUrl = AppComponent.MainUrl + "admins/"
  public static StudentUrl = AppComponent.MainUrl + "users/"
  static language = "ar"
  public static buildings: Building[] = []
  public static rooms: Room[] = []
  public static admin: Admin[] = []
  public static students: Student[] = []
  public static college: College[] = []
  public static roomType: RoomType[] = []
  public static facilitie: Facilitie[] = []
  public static reservations: Reservation[] = []
  // public static handleError(error: object) {
  //   let er = ""
  //   let keys = Object.keys(error)
  //   let values = Object.values(error)
  //   for (let i = 0; i < keys.length; i++) {
  //     if (i == keys.length - 1) {
  //       er = er + keys[i] + " : " + values[i]
  //     }
  //     else {
  //       er = er + keys[i] + " : " + values[i] + "\n"
  //     }
  //   }
  //   return er
  // }

  changeLanguage(id: string) {
    if (id == "ar") {
      AppComponent.language = "ar"
    } else if (id == "en") {
      AppComponent.language = "en"
    }
  }
}
