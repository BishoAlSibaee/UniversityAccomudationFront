import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { Building } from '../Building';
import { ApiLinks } from '../ApiLinks';
import { LoadingDialogComponent } from '../loading-dialog/loading-dialog.component';
import { Reservation } from '../Reservation';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-get-reservation',
  templateUrl: './get-reservation.component.html',
  styleUrls: ['./get-reservation.component.css']
})
export class GetReservationComponent {
  private _snackBar = inject(MatSnackBar);
  selectedBuildingId: number = 0;
  buildings: Building[] = [];
  reservation: Reservation[] = [];
  startDate: string = '';
  expirDate: string = '';
  by: string = ''
  showBuilding: boolean = false;
  showDate: boolean = false;
  showText: boolean = false

  constructor(private router: Router, private client: HttpClient, private dialog: MatDialog) { }

  ngOnInit() {
    this.buildings = AppComponent.buildings;
    if (this.buildings.length === 0) {
      this.router.navigate(['/mainPage']);
    } else {
      this.selectedBuildingId = this.buildings[0].id;
    }
  }

  onChangeSearchType() {
    console.log(this.by);
    if (this.by === "allReservation") {
      this.showBuilding = true
      this.showDate = true
      this.showText = false
    }
    if (this.by === "byNumber" || this.by === "byName") {
      this.showBuilding = false
      this.showDate = false
      this.showText = false
    }
    if (this.by === "byRoomNumber") {
      this.showBuilding = true
      this.showDate = false
      this.showText = false
    }
  }

  onBuildingChange(buildingId: number | null) {
    // const selectedBuilding = this.buildings.find(b => b.id === buildingId);
    // if (selectedBuilding) {
    //   this.filteredFloors = selectedBuilding.floors || [];
    //   this.selectedFloorId = null;
    //   this.selectedFloorId = 'all';
    // }
  }

  getReservation() {
    let StartDate = new Date(this.startDate)
    let ExpireDate = new Date(this.expirDate)
    let Start = StartDate.getFullYear() + "-" + (StartDate.getMonth() + 1) + "-" + StartDate.getDate()
    let Expire = ExpireDate.getFullYear() + "-" + (ExpireDate.getMonth() + 1) + "-" + ExpireDate.getDate()

    const dialogRef = this.dialog.open(LoadingDialogComponent, { disableClose: true });
    let params = new FormData();
    params.append("start_date", Start);
    params.append("expire_date", Expire);

    const token = localStorage.getItem("token")
    const h = new HttpHeaders({ Authorization: "Bearer " + token, });
    let options = { headers: h }
    this.client.post<any>(ApiLinks.getReservationByDate, params, options).subscribe({
      next: (result) => {
        if (result.code === 1) {
          console.log("Result = " + result)
          this.reservation = result.reservations
        } else {
          this.openSnackBar(result.error, "Ok");
        }
      }, error: (error) => {
        console.log(error)
      },
      complete: () => {
        dialogRef.close();
      }
    })
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 6000,
      panelClass: ['custom-snackbar']
    });
  }
}
