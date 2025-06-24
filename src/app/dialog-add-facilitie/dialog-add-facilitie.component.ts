import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Building } from '../Building';
import { Floor } from '../Floor';
import { AppComponent } from '../app.component';
import { RoomType } from '../RoomType';
import { ApiLinks } from '../ApiLinks';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Facilitie } from '../Facilitie';
import { RoomService } from '../room.service';
import { translates } from '../translates';

@Component({
  selector: 'app-dialog-add-facilitie',
  templateUrl: './dialog-add-facilitie.component.html',
  styleUrls: ['./dialog-add-facilitie.component.css']
})
export class DialogAddFacilitieComponent {
  private _snackBar = inject(MatSnackBar);
  name_ar: string = ""
  name_en: string = ""
  building_id: number = 0
  buildingId: number = 0;
  floorId: number = 0;
  allBuilding: Building[] = []
  floor: Floor[] = []
  roomTypes: RoomType[] = []
  selectedRoomTypeId: number = 0;
  selectedBuildingName: any;
  selectedFloorNumber: any;
  selectedRoomType: string = ''

  constructor(private client: HttpClient, public dialogRef: MatDialogRef<DialogAddFacilitieComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private roomService: RoomService) {
    translates.create()
  }

  ngOnInit() {
    this.allBuilding = AppComponent.buildings;
    this.roomTypes = AppComponent.roomType
  }

  onBuildingChange(event: Event) {
    const selectedBuildingId = (event.target as HTMLSelectElement).value;
    if (selectedBuildingId) {
      this.buildingId = +selectedBuildingId;
      this.selectedFloorNumber = null;
      this.floorId = 0;
      this.floorInBuilding(this.buildingId);
    }
  }

  floorInBuilding(buildingId: number) {
    this.floor = [];
    this.allBuilding.forEach(building => {
      if (building.id === buildingId) {
        this.floor.push(...building.floors)
      }
    })
  }

  onFloorChange(event: Event) {
    const selectedFloorId = (event.target as HTMLSelectElement).value;
    if (selectedFloorId) {
      this.floorId = +selectedFloorId;
    }
  }

  onRoomTypeChange(event: Event) {
    const selectedRoomTypeId = (event.target as HTMLSelectElement).value;
    if (selectedRoomTypeId) {
      this.selectedRoomTypeId = +selectedRoomTypeId
    }
  }

  addFacilitie() {
    let params = new FormData();
    params.append("name_ar", this.name_ar);
    params.append("name_en", this.name_en);
    if (this.buildingId === 0) {
      params.append("building_id", '0');
    } else {
      params.append("building_id", this.buildingId.toString());
    }
    if (this.floorId === 0) {
      params.append("floor_id", '0');
    } else {
      params.append("floor_id", this.floorId.toString());
    }
    if (this.selectedRoomTypeId === 0) {
      params.append("room_types_id", '0');
    }
    else {
      params.append("room_types_id", this.selectedRoomTypeId.toString());
    }
    const token = localStorage.getItem("token")
    const h = new HttpHeaders({ Authorization: "Bearer " + token, });
    let options = { headers: h };
    this.client.post<any>(ApiLinks.addFacilitie, params, options).subscribe({
      next: (result) => {
        console.log(result)
        if (result.code == 1) {
          console.log("success");
          const newFacilitie = new Facilitie(result.facilitie.id, result.facilitie.name_ar, result.facilitie.name_en, Number(result.facilitie.building_id), Number(result.facilitie.floor_id), result.facilitie.suite_id, Number(result.facilitie.room_types_id), '')
          AppComponent.facilitie.push(newFacilitie)
          console.table(AppComponent.facilitie)
          this.roomService.refreshfacilitieList();
          this.dialogRef.close();
          this.openSnackBar(this.getTranslate('AddDone'), "Ok");
        } else {
          if (result.error.name) {
            this.openSnackBar(result.error, "Ok");
            console.log("Warning");
          }
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

  onNoClick(): void {
    this.dialogRef.close();
  }

  getTranslate(id: string) {
    return translates.getTranslate(id)
  }
}
