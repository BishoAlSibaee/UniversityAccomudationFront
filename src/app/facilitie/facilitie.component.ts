import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiLinks } from '../ApiLinks';
import { LoadingDialogComponent } from '../loading-dialog/loading-dialog.component';
import { Facilitie } from '../Facilitie';
import { DialogAddFacilitieComponent } from '../dialog-add-facilitie/dialog-add-facilitie.component';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { RoomService } from '../room.service';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';

@Component({
  selector: 'app-facilitie',
  templateUrl: './facilitie.component.html',
  styleUrls: ['./facilitie.component.css']
})
export class FacilitieComponent {
  facilitie: Facilitie[] = []
  constructor(private router: Router, private client: HttpClient, public dialog: MatDialog, private roomService: RoomService) { }

  ngOnInit() {
    if (AppComponent.buildings.length === 0) {
      this.router.navigate(['/mainPage']);
    }
    this.getAllFacilitie();
    this.roomService.facilitieListUpdated$.subscribe(() => {
      this.facilitie = AppComponent.facilitie
    });
  }

  getAllFacilitie() {
    const dialogRef = this.dialog.open(LoadingDialogComponent, { disableClose: true });
    const token = localStorage.getItem("token")
    const h = new HttpHeaders({ Authorization: "Bearer " + token });
    let options = { headers: h };
    this.client.get<Facilitie[]>(ApiLinks.getFacilitie, options).subscribe({
      next: (result) => {
        AppComponent.facilitie = result
        this.facilitie = AppComponent.facilitie
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

  openDialogAdd(): void {
    this.dialog.open(DialogAddFacilitieComponent)
  }

  openDeleteDialog(id: number, name: string): void {
    this.dialog.open(DialogDeleteComponent, {
      data: { id: id, name: name }
    });

  }

  getNameBuilding(idBuilding: number) {
    let name = ""
    AppComponent.buildings.forEach(b => {
      if (b.id === idBuilding) {
        name = b.name
      }
    })
    return name
  }

  getNameRoomTypes(idRoomTypes: number) {
    let name = ""
    AppComponent.roomType.forEach(b => {
      if (b.id === idRoomTypes) {
        name = b.name_ar
      }
    })
    return name
  }
}
