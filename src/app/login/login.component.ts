import { Component } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { MainPageComponent } from '../main-page/main-page.component';
import { ApiLinks } from '../ApiLinks';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  message = ""
  DarkColor = "#015095"
  LightColor = "#3d2706"
  // loginUrl = AppComponent.AdminUrl + "login"
  user = ""
  password = ""

  constructor(
    private router: Router
  ) {

  }

  ngOnInit() {
    localStorage.removeItem('token');
    console.log("token = " + localStorage.getItem('token'))
  }

  async logIn() {
    this.message = ""
    let params = new FormData()
    params.append("email", this.user)
    params.append("password", this.password)
    let result = await (await fetch(ApiLinks.adminLogin, { method: 'POST', body: params })).json()
    console.log(result)
    if (result.code == 1) {
      console.log("login done")
      // AppComponent.token = result.token
      localStorage.setItem('token', result.token);
      this.router.navigate(['mainPage'])
    } else {
      console.log(result.error)
      if (typeof result.error == "object") {
        if (result.error.email != null) {
          this.message = result.error.email
        }
        if (result.error.password != null) {
          this.message = this.message + " " + result.error.password
        }
      }
      else {
        this.message = result.error
      }
    }
  }
}
