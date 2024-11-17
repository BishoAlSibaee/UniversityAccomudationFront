import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ApiLinks } from '../ApiLinks';
import { Admin } from '../Admin';
import { AppComponent } from '../app.component';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../user.service';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';
import { LoadingDialogComponent } from '../loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent {
  listAdmin: Admin[] = [];

  constructor(private client: HttpClient, public dialog: MatDialog, private userService: UserService) { }

  ngOnInit() {
    this.getAllAdmin()
    this.userService.userUpdated$.subscribe(() => {
      this.listAdmin = AppComponent.admin
    });
  }

  getAllAdmin() {
    const dialogRef = this.dialog.open(LoadingDialogComponent, { disableClose: true });

    let params = new FormData();
    const token = localStorage.getItem("token")
    const h = new HttpHeaders({
      Authorization: "Bearer " + token,
    });
    let options = { headers: h };
    this.client.post<any>(ApiLinks.getAllAdmin, params, options).subscribe({
      next: (result) => {
        AppComponent.admin = result.admin
        this.listAdmin = AppComponent.admin
      },
      error: (error) => {
        console.log("Error");
        console.log(error);
      },
      complete: () => {
        dialogRef.close();
      }
    });
  }

  openDialog(id: number, name: string, mobile: string, email: string, isAdmin: number, action: string): void {
    if (id != 0) {
      this.dialog.open(DialogAddUserComponent, {
        data: { id: id, name: name, mobile: mobile, email: email, isAdmin: isAdmin, action: action }
      });
    } else {
      this.dialog.open(DialogAddUserComponent);

    }
  }

  openDeleteDialog(id: number, name: string): void {
    this.dialog.open(DialogDeleteComponent, {
      data: { id: id, name: name }
    });
    // dialogRef.componentInstance.refreshListRoom.subscribe(() => {
    //   console.log("ENTER ")
    //   this.allRoom = AppComponent.rooms;
    //   this.filterRooms();
    // });

  }

  isAdmain(isAdmin: number) {
    if (isAdmin == 0) {
      return "Admin"
    } else {
      return "User"
    }
  }
}
