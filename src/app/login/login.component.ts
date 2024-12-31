import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiLinks } from '../ApiLinks';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  message = ""
  DarkColor = "#015095"
  LightColor = "#3d2706"
  user = ""
  password = ""

  constructor(private router: Router, private client: HttpClient) { }

  ngOnInit() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    console.log("token = " + localStorage.getItem('token'))
  }

  async logIn() {
    this.message = "";
    let params = new FormData();
    params.append("email", this.user);
    params.append("password", this.password);

    let result = await (await fetch(ApiLinks.adminLogin, { method: 'POST', body: params })).json();
    console.log(result);

    if (result.code == 1) {
      console.log("login done");
      localStorage.setItem('token', result.token);
      localStorage.setItem('userName', result.name);
      localStorage.setItem('userId', result.id);

      // await this.getAllRoomType();

      this.router.navigate(['mainPage']);
    } else {
      console.log(result.error);
      if (typeof result.error == "object") {
        if (result.error.email != null) {
          this.message = result.error.email;
        }
        if (result.error.password != null) {
          this.message = this.message + " " + result.error.password;
        }
      }
      else {
        this.message = result.error;
      }
    }
  }

  // getAllRoomType() {
  //   return new Promise<void>((resolve, reject) => {
  //     const token = localStorage.getItem("token");
  //     const h = new HttpHeaders({
  //       Authorization: "Bearer " + token,
  //     });
  //     let options = { headers: h };

  //     this.client.get<RoomType[]>(ApiLinks.getAllRoomType, options).subscribe({
  //       next: (result) => {
  //         AppComponent.roomType = result;
  //         console.log(AppComponent.roomType);
  //         resolve();
  //       },
  //       error: (error) => {
  //         console.log("Error");
  //         console.log(error);
  //         reject(error);
  //       },
  //     });
  //   });
  // }
}
