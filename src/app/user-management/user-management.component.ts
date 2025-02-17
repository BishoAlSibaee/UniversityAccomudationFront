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
import { translates } from '../translates';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent {
  listAdmin: Admin[] = [];
  // admins: Admin[] = [];
  constructor(private client: HttpClient, public dialog: MatDialog, private userService: UserService) {
    translates.create()
    // this.admins = [
    //   new Admin(1, "Ali Hassan", "9876543210", "ali.hassan@example.com", 1, 1),
    //   new Admin(2, "Sara Ahmed", "8765432109", "sara.ahmed@example.com", 0, 1),
    //   new Admin(3, "Omar Khalid", "7654321098", "omar.khalid@example.com", 1, 1),
    //   new Admin(4, "Layla Noor", "6543210987", "layla.noor@example.com", 0, 1),
    //   new Admin(5, "Khaled Mahmoud", "5432109876", "khaled.mahmoud@example.com", 1, 1),
    //   new Admin(6, "Hanan Saeed", "4321098765", "hanan.saeed@example.com", 0, 1),
    //   new Admin(7, "Youssef Ali", "3210987654", "youssef.ali@example.com", 1, 1),
    //   new Admin(8, "Fatima Omar", "2109876543", "fatima.omar@example.com", 0, 1),
    //   new Admin(9, "Mustafa Salem", "1098765432", "mustafa.salem@example.com", 1, 1),
    //   new Admin(10, "Rania Adel", "0987654321", "rania.adel@example.com", 0, 1),
    //   new Admin(11, "Nour Mohamed", "9876504321", "nour.mohamed@example.com", 1, 1),
    //   new Admin(12, "Hadi Kareem", "8765403219", "hadi.kareem@example.com", 0, 1),
    //   new Admin(13, "Salma Fawzy", "7654302198", "salma.fawzy@example.com", 1, 1),
    //   new Admin(14, "Jamal Nasser", "6543201987", "jamal.nasser@example.com", 0, 1),
    //   new Admin(15, "Amira Sameer", "5432109870", "amira.sameer@example.com", 1, 1),
    //   new Admin(16, "Bassel Omar", "4321098761", "bassel.omar@example.com", 0, 1),
    //   new Admin(17, "Dalia Hassan", "3210987652", "dalia.hassan@example.com", 1, 1),
    //   new Admin(18, "Ziad Tariq", "2109876543", "ziad.tariq@example.com", 0, 1),
    //   new Admin(19, "Rasha Kareem", "1098765434", "rasha.kareem@example.com", 1, 1),
    //   new Admin(20, "Faris Hatem", "0987654325", "faris.hatem@example.com", 0, 1),
    // ];
  }

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
      panelClass: ['dialog-panel-delete'],
      data: { id: id, name: name }
    });
  }

  isAdmain(isAdmin: number) {
    if (isAdmin == 0) {
      return this.getTranslate('Admin')
    } else {
      return this.getTranslate('User')
    }
  }

  getTranslate(id: string) {
    return translates.getTranslate(id)
  }
}
