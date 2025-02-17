import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Building } from '../Building';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditAndAddBuilding } from '../dialog-edit-and-add-building/dialog-edit-and-add-building.component';
import { AppComponent } from '../app.component';
import { MainPageComponent } from '../main-page/main-page.component';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';
import { translates } from '../translates';

@Component({
  selector: 'app-add-building',
  templateUrl: './add-building.component.html',
  styleUrls: ['./add-building.component.css']
})


export class AddBuildingComponent {
  buildingName: string = "";
  buildingNumber: string = "0";
  buildings: Building[] = [];
  private _snackBar = inject(MatSnackBar);

  constructor(public dialog: MatDialog, private router: Router) {
    translates.create()
  }

  ngOnInit() {
    if (AppComponent.buildings.length === 0 && !MainPageComponent.isAddingMode) {
      this.router.navigate(['/mainPage']);
    } else if (MainPageComponent.isAddingMode) {
      MainPageComponent.isAddingMode = false;
      this.buildings = AppComponent.buildings
    }
  }

  getTotalSuite(building: Building): number {
    return building.floors.reduce((total, floor) => total + floor.suites.length, 0);
  }

  getTotalRooms(buildingId: number): number {
    const building = this.buildings.find(b => b.id === buildingId);
    if (!building) return 0;
    const singelRooms = AppComponent.rooms.filter(room => room.building_id === buildingId).length;
    return singelRooms
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 6000,
      panelClass: ['custom-snackbar']
    });
  }

  openDialog(buildingId: number, buildingName: string | null, buildingNumber: number) {
    if (buildingId !== 0 && buildingName !== null && buildingNumber !== 0) {
      this.dialog.open(DialogEditAndAddBuilding, {
        data: { id: buildingId, name: buildingName, number: buildingNumber }
      });
    } else {
      this.dialog.open(DialogEditAndAddBuilding);
    }
  }

  openDeleteDialog(id: number, buildingId: number, floorId: number, name: string): void {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      data: { id: id, buildingId: buildingId, floorId: floorId, name: name }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Item deleted');
      } else {
        console.log('Deletion cancelled');
      }
    });
  }

  getTranslate(id: string) {
    return translates.getTranslate(id)
  }

}
