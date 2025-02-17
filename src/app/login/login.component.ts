import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiLinks } from '../ApiLinks';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { translates } from '../translates';
import { LoadingDialogComponent } from '../loading-dialog/loading-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private _snackBar = inject(MatSnackBar);
  user: string = ""
  password: string = ""

  constructor(private router: Router, private client: HttpClient, public dialog: MatDialog) {
    translates.create()
  }

  ngOnInit() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
  }

  async logIn() {
    if (this.user === '' || this.password === '') {
      return this.openSnackBar(this.getTranslate('Required'), "Ok");
    }
    const dialogRef = this.dialog.open(LoadingDialogComponent, { disableClose: true });

    let params = new FormData();
    params.append("email", this.user);
    params.append("password", this.password);

    let result = await (await fetch(ApiLinks.adminLogin, { method: 'POST', body: params })).json();

    if (result.code == 1) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('userName', result.name);
      localStorage.setItem('userId', result.id);
      this.router.navigate(['mainPage']);
    } else {
      if (typeof result.error == "object") {
        if (result.error.email != null) {
          dialogRef.close();
          return this.openSnackBar(result.error.email, "Ok");
        }
        if (result.error.password != null) {
          dialogRef.close();
          return this.openSnackBar(result.error.password, "Ok");
        }
      }
      else {
        dialogRef.close();
        return this.openSnackBar(result.error, "Ok");
      }
    }
    dialogRef.close();

  }

  getTranslate(id: string) {
    return translates.getTranslate(id)
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 6000,
      panelClass: ['custom-snackbar']
    });
  }
}
