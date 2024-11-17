import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiLinks } from '../ApiLinks';
import { AppComponent } from '../app.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Admin } from '../Admin';
import { UserService } from '../user.service';

@Component({
  selector: 'app-dialog-add-user',
  templateUrl: './dialog-add-user.component.html',
  styleUrls: ['./dialog-add-user.component.css']
})
export class DialogAddUserComponent {
  private _snackBar = inject(MatSnackBar);
  name: string = "";
  mobile: string = "";
  email: string = "";
  password: string = "";
  password_confirmation: string = "";
  isAdmin: number = 1;
  adminId: number = 0;
  nameBtn: string = "Add";
  constructor(private client: HttpClient, public dialogRef: MatDialogRef<DialogAddUserComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private userService: UserService) {
    if (data) {
      this.adminId = data.id;
      this.name = data.name;
      this.mobile = data.mobile;
      this.email = data.email;
      this.isAdmin = data.isAdmin;
      this.nameBtn = data.action;
    }
  }

  addUser() {
    if (this.name === "" || this.email === "" || this.password === "" || this.password_confirmation === "") {
      return this.openSnackBar("All Required", "Ok");

    }
    if (this.password !== this.password_confirmation) {
      return this.openSnackBar("Password does not match", "Ok");
    }
    if (this.password.length < 4) {
      return this.openSnackBar("The password field must be at least 4 characters.", "Ok");
    }
    let params = new FormData();
    params.append("email", this.email);
    params.append("name", this.name);
    params.append("mobile", this.mobile);
    params.append("is_admin", this.isAdmin.toString());
    params.append("password", this.password);
    params.append("password_confirmation", this.password_confirmation);
    const token = localStorage.getItem("token")
    const h = new HttpHeaders({
      Authorization: "Bearer " + token,
    });
    let options = { headers: h };
    this.client.post<any>(ApiLinks.create_admin, params, options).subscribe({
      next: (result) => {
        if (result.code === 1) {
          const newAdmin = new Admin(result.user.id, result.user.name, result.user.mobile, result.user.email, Number(result.user.is_admin), Number(result.user.is_active))
          AppComponent.admin.push(newAdmin)
          this.userService.refreshUserList();
          this.dialogRef.close()
          return this.openSnackBar("Add Done", "Ok");
        } else {
          if (result.error.mobile != null) {
            return this.openSnackBar(result.error.mobile, "Ok");
          }
          if (result.error.password != null) {
            return this.openSnackBar(result.error.password, "Ok");
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

  updateUser() {
    if (this.name === "" || this.email === "" || this.mobile === "") {
      return this.openSnackBar("All Required", "Ok");
    }
    let params = new FormData();
    params.append("id", this.adminId.toString());
    params.append("email", this.email);
    params.append("name", this.name);
    params.append("mobile", this.mobile);
    params.append("is_admin", this.isAdmin.toString());
    const token = localStorage.getItem("token")
    const h = new HttpHeaders({
      Authorization: "Bearer " + token,
    });
    let options = { headers: h };
    this.client.post<any>(ApiLinks.updateAdmin, params, options).subscribe({
      next: (result) => {
        if (result.code === 1) {
          const index = AppComponent.admin.findIndex(admin => admin.id === result.user.id);
          if (index !== -1) {
            AppComponent.admin[index] = new Admin(result.user.id, result.user.name, result.user.mobile, result.user.email, Number(result.user.is_admin), Number(result.user.is_active));
          }
          this.userService.refreshUserList();
          this.dialogRef.close()
          return this.openSnackBar("Update Done", "Ok");
        } else {
          if (result.error.mobile != null) {
            return this.openSnackBar(result.error.mobile, "Ok");
          }
          if (result.error.password != null) {
            return this.openSnackBar(result.error.password, "Ok");
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

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClickOk() {
    if (this.nameBtn === 'Add') {
      this.addUser()
    } else {
      this.updateUser()
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 6000,
      panelClass: ['custom-snackbar']
    });
  }

  isAdd() {
    if (this.nameBtn === 'Add') {
      return true
    }
    return false
  }
}
