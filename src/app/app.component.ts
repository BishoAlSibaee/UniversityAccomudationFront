import { Component } from '@angular/core';

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
  public static token = ""

  public static handleError(error:object) {
    let er = ""
    let keys = Object.keys(error)
    let values = Object.values(error)
    for (let i=0;i<keys.length;i++) {
      if (i == keys.length-1) {
        er = er + keys[i]+" : "+values[i]
      }
      else {
        er = er + keys[i]+" : "+values[i]+"\n"
      }
    }
    return er
  }

}
