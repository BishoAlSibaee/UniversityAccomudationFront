import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Building } from '../Building';
import { AppComponent } from '../app.component';
import { ApiLinks } from '../ApiLinks';
import { Floor } from '../Floor';

@Component({
  selector: 'app-dialog-edit-and-add-floor',
  templateUrl: './dialog-edit-and-add-floor.component.html',
  styleUrls: ['./dialog-edit-and-add-floor.component.css']
})
export class DialogEditAndAddFloorComponent {
  private _snackBar = inject(MatSnackBar);
  buildingId: number = 0;
  floorId: number = 0;
  floorNumber: number = 0;
  title: string = "Add New Floor"
  nameBtn: string = "Add"
  allBuilding: Building[] = []
  selectedBuildingName: any;

  constructor(private client: HttpClient, public dialogRef: MatDialogRef<DialogEditAndAddFloorComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog) {
    if (data) {
      this.buildingId = data.buildingId || 0;
      this.floorId = data.floorId || 0;
      this.floorNumber = data.floorNumber || 0;
      this.title = "Update Floor"
      this.nameBtn = "Update"
    }
  }

  ngOnInit() {
    this.allBuilding = AppComponent.buildings;
  }

  onBuildingChange(selectedBuilding: Building) {
    this.buildingId = selectedBuilding.id
  }

  onClickCancel(): void {
    this.dialogRef.close();
  }

  onClickOk() {
    if (this.title === "Update Floor" && this.nameBtn === "Update") {
      console.log(this.nameBtn)
      this.updateFloor()
    } else {
      console.log(this.nameBtn)
      this.addFloor();
    }
  }

  addFloor() {
    console.log(this.buildingId + "BULDING ")
    if (this.buildingId == 0 && this.floorNumber == 0) {
      return this.openSnackBar("All Required", "Ok");
    }
    let params = new FormData();
    params.append("building_id", this.buildingId.toString());
    params.append("number", this.floorNumber.toString());
    const token = localStorage.getItem("token")
    const h = new HttpHeaders({ Authorization: "Bearer " + token, });
    let options = { headers: h };
    this.client.post<any>(ApiLinks.addFloor, params, options).subscribe({
      next: (result) => {
        console.log(result)
        if (result.code == 1) {
          console.log("success");
          const newFloor = new Floor(0, 0, 0, "", []);
          newFloor.id = result.floor.id
          newFloor.number = result.floor.number;
          newFloor.building_id = result.floor.building_id;
          const building = AppComponent.buildings.find(b => b.id === this.buildingId)
          if (building) {
            building.floors.push(newFloor);
          }
          this.dialogRef.close();
          this.openSnackBar("Add Done", "Ok");
        } else {
          this.openSnackBar(result.error, "Ok");
          if (result.error.name) {
            this.openSnackBar(result.error.name, "Ok");
            console.log("Warning");
          } else {
            if (result.error.number) {
              this.openSnackBar(result.error.number, "Ok");
              console.log("Warning");
            }
          }
        }
      }, error: (error) => {
        this.openSnackBar(error, "Ok");
        console.log("Error" + error);
      }
    });
  }

  updateFloor() {
    if (this.floorNumber === 0) {
      return this.openSnackBar("All Required", "Ok");
    }
    let params = new FormData();
    params.append("id", this.floorId.toString());
    params.append("number", this.floorNumber.toString());
    const token = localStorage.getItem("token")
    const h = new HttpHeaders({ Authorization: "Bearer " + token, });
    let options = { headers: h };
    this.client.post<any>(ApiLinks.updateFloor, params, options).subscribe({
      next: (result) => {
        if (result.code == 1) {
          console.log("success");
          console.log(result);
          const building = AppComponent.buildings.find(b => b.id === this.buildingId);
          if (building) {
            const floor = building.floors.find(f => f.id === this.floorId);
            if (floor) {
              floor.number = this.floorNumber;
            }
          }
          this.dialogRef.close();
          this.openSnackBar("Update Done", "Ok");
        } else {
          console.log("Warning");
          this.openSnackBar(result.error, "Ok");
        }
      }, error: (error) => {
        console.log("Error" + error);
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 6000,
      panelClass: ['custom-snackbar']
    });
  }

  showListBuilding(): boolean {
    if (this.nameBtn === "Update") {
      return false
    }
    return true
  }
}

