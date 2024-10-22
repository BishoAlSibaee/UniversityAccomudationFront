import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiLinks } from '../ApiLinks';
import { Building } from '../Building';
import { AppComponent } from '../app.component';
import { Floor } from '../Floor';


@Component({
  selector: 'app-dialog-content-example',
  templateUrl: './dialog-edit-and-add-building.component.html',
})
export class DialogEditAndAddBuilding {
  private _snackBar = inject(MatSnackBar);
  buildingName: string = "";
  buildingNumber: number = 0;
  buildingId: number = 0;
  numberOfFloor: number = 0
  numberFloor: number = 0;
  title: string = "Add New Building"
  nameBtn: string = "Add"

  constructor(private client: HttpClient, public dialogRef: MatDialogRef<DialogEditAndAddBuilding>, @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog) {
    if (data) {
      this.buildingName = data.name || '';
      this.buildingNumber = data.number || 0;
      this.buildingId = data.id || 0;
      this.title = "Update Building"
      this.nameBtn = "Update"
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClickOk() {
    if (this.title === "Update Building" && this.nameBtn === "Update") {
      console.log(this.nameBtn)
      this.updateBuilding();
    } else {
      console.log(this.nameBtn)
      this.addBuilding();
    }
  }

  ngOnInit() { }

  addBuilding() {
    if (this.buildingName === "" || this.buildingNumber === 0 || this.numberOfFloor === 0 || this.numberFloor === 0) {
      return this.openSnackBar("All Required", "Ok");
    }
    let params = new FormData();
    params.append("name", this.buildingName);
    params.append("number", this.buildingNumber.toString());
    params.append("numberOfFloor", this.numberOfFloor.toString());
    params.append("numberFloor", this.numberFloor.toString());
    const token = localStorage.getItem("token")
    const h = new HttpHeaders({ Authorization: "Bearer " + token, });
    let options = { headers: h };
    this.client.post<any>(ApiLinks.addBuilding, params, options).subscribe({
      next: (result) => {
        console.log(result)
        if (result.code == 1) {
          console.log("success");
          const newBuilding = new Building(result.building.id, result.building.number, result.building.name, "", []);
          for (let i = 0; i < result.floors.length; i++) {
            const floor = result.floors[i];
            const newFloor = new Floor(floor.id, floor.number, newBuilding.id, "", []);
            newBuilding.floors.push(newFloor);
          }
          AppComponent.buildings.push(newBuilding);
          this.dialogRef.close();
          this.openSnackBar("Add Done", "Ok");
        } else {
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
        console.log("Error" + error);
      }
    });
  }

  updateBuilding() {
    if (this.buildingName == "" || this.buildingNumber == 0) {
      return this.openSnackBar("All Required", "Ok");
    }
    let params = new FormData();
    params.append("id", this.buildingId.toString());
    params.append("name", this.buildingName);
    params.append("number", this.buildingNumber.toString());
    const token = localStorage.getItem("token")
    const h = new HttpHeaders({ Authorization: "Bearer " + token, });
    let options = { headers: h };
    this.client.post<any>(ApiLinks.updateBuilding, params, options).subscribe({
      next: (result) => {
        if (result.code == 1) {
          console.log("success");
          console.log(result);
          const oldBuilding = AppComponent.buildings.find(building => building.id === this.buildingId);
          if (oldBuilding) {
            const updatedBuilding = new Building(
              this.buildingId,
              this.buildingNumber,
              this.buildingName,
              oldBuilding.lock_id,
              oldBuilding.floors
            );
            const index = AppComponent.buildings.findIndex(building => building.id === this.buildingId);
            if (index !== -1) {
              AppComponent.buildings[index] = updatedBuilding;
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

  showFormFieldFloor() {
    if (this.nameBtn === "Add") {
      return true
    }
    return false
  }
}
