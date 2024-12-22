import { Component, inject, Inject } from '@angular/core';
import { Floor } from '../Floor';
import { Building } from '../Building';
import { AppComponent } from '../app.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiLinks } from '../ApiLinks';
import { LoadingDialogComponent } from '../loading-dialog/loading-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Room } from '../Room';
import { Facilitie } from '../Facilitie';

@Component({
  selector: 'app-update-reservation',
  templateUrl: './update-reservation.component.html',
  styleUrls: ['./update-reservation.component.css'],
  animations: [
    trigger('slideToggle', [
      state('void', style({ height: '0', opacity: '0', overflow: 'hidden' })),
      state('*', style({ height: '*', opacity: '1', overflow: 'visible' })),
      transition(':enter', [animate('300ms ease-out')]),
      transition(':leave', [animate('300ms ease-in')]),
    ]),
  ],
})
export class UpdateReservationComponent {
  private _snackBar = inject(MatSnackBar);
  by: string = '';
  startDate: string = '';
  expirDate: string = '';
  listBuilding: Building[] = []
  filteredFloors: Floor[] = [];
  availableRooms: Room[] = []
  facilitie: Facilitie[] = []
  selectedFacilities: number[] = [];
  selectedBuildingName: any;
  selectedFloorName: any;
  editRoom: boolean = false;
  editDate: boolean = false;
  editFacility: boolean = false;
  selectedOption: number = 0;
  selectedBuildingId: number = 0;
  selectedFloorId: string | number | null = 'all';
  selectedRoomNumber: number = 0;
  selectedRoomId: number = 0;
  building_id: number = 0;
  floor_id: number = 0;
  suite_id: number = 0;
  is_update_facility: number = 0;
  Start: any
  Expire: any

  constructor(private client: HttpClient, public dialogRef: MatDialogRef<UpdateReservationComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog) {
    let facilityIds = JSON.parse(data.facility_ids);
    this.selectedFacilities.push(...facilityIds);
    this.getInfoRoom();
    this.getFacilitieByRoom()
  }

  ngOnInit() {
    this.listBuilding = AppComponent.buildings;
    this.selectedBuildingId = this.listBuilding[0].id;
    this.onBuildingChange(this.selectedBuildingId);
    const startDate1 = new Date(this.data.start_date);
    this.startDate = startDate1.getFullYear() + '-' + (startDate1.getMonth() + 1).toString().padStart(2, '0') + '-' + startDate1.getDate().toString().padStart(2, '0');
  }

  checkReservation() {
    if (this.startDate === '' || this.expirDate === '') {
      //في حال ماتغير التاريخ رح ياخد القيم المرسلة من الحجز الأصلي
      let StartDate = new Date(this.data.start_date)
      let ExpireDate = new Date(this.data.expire_date)
      this.Start = StartDate.getFullYear() + "-" + (StartDate.getMonth() + 1) + "-" + StartDate.getDate()
      this.Expire = ExpireDate.getFullYear() + "-" + (ExpireDate.getMonth() + 1) + "-" + ExpireDate.getDate()
    } else {
      //في حال تغير التاريخ رح ياخد القيم من التاريخ الي تغير
      let StartDate = new Date(this.startDate)
      let ExpireDate = new Date(this.expirDate)
      this.Start = StartDate.getFullYear() + "-" + (StartDate.getMonth() + 1) + "-" + StartDate.getDate()
      this.Expire = ExpireDate.getFullYear() + "-" + (ExpireDate.getMonth() + 1) + "-" + ExpireDate.getDate()
    }
    if (this.selectedFloorId !== 'all' && this.selectedFloorId != null) {
      console.log("selectedFloorId = " + this.selectedFloorId.toString())
    }
    if (this.selectedBuildingId === 0) {
      return this.openSnackBar("All Required", "Ok");
    }
    if (this.selectedOption === 0) {
      return this.openSnackBar("Select the type search ", "Ok");
    }
    const dialogRef = this.dialog.open(LoadingDialogComponent, { disableClose: true });
    let params = new FormData();
    params.append("building_id", this.selectedBuildingId.toString());
    if (this.selectedFloorId !== 'all' && this.selectedFloorId != null) {
      params.append("floor_id", this.selectedFloorId.toString());
    }
    params.append("start_date", this.Start);
    params.append("expire_date", this.Expire);
    params.append("type_search", this.selectedOption.toString());
    const token = localStorage.getItem("token")
    const h = new HttpHeaders({ Authorization: "Bearer " + token, });
    let options = { headers: h }
    this.client.post<any>(ApiLinks.checkReservation, params, options).subscribe({
      next: (result) => {
        console.log(result)
        if (result.code === 1) {
          this.availableRooms = result.AvailableRooms
          this.selectedRoomNumber = 0;
          this.availableRooms.sort((a, b) => { return a.number - b.number; });
          console.log("result = " + result.AvailableRooms)
          console.table(result.AvailableRooms)
        } else {
          return this.openSnackBar(result.error, "Ok");
        }
      }, error: (error) => {
        console.log(error)
        return this.openSnackBar(error, "Ok");
      },
      complete: () => {
        dialogRef.close();
      }
    })
  }

  updateReservation() {
    this.compareFacilities()
    if (this.is_update_facility === 0 && this.selectedRoomNumber === 0 && this.expirDate === '') {
      return this.openSnackBar("Nothing has been ubdate.", "Ok");
    }
    let params = new FormData();
    if (this.expirDate !== '') {
      let StartDate = new Date(this.startDate)
      let ExpireDate = new Date(this.expirDate)
      if (ExpireDate < StartDate) {
        return this.openSnackBar("End date cannot be before the start date.", "Ok");
      }
      this.Start = StartDate.getFullYear() + "-" + (StartDate.getMonth() + 1).toString().padStart(2, '0') + "-" + StartDate.getDate().toString().padStart(2, '0');
      this.Expire = ExpireDate.getFullYear() + "-" + (ExpireDate.getMonth() + 1).toString().padStart(2, '0') + "-" + ExpireDate.getDate().toString().padStart(2, '0');
      if (this.Expire !== this.data.expire_date) {
        params.append("is_update_date", '1');
        params.append("new_start_date", this.Start);
        params.append("new_expire_date", this.Expire);
      }
    }
    if (this.selectedRoomNumber !== 0) {
      params.append("is_update_room", '1');
      params.append("new_room_id", this.selectedRoomId.toString());
      params.append("new_room_number", this.selectedRoomNumber.toString());
    }
    if (this.is_update_facility === 1) {
      params.append("is_update_facility", '1');
      params.append("new_facility_ids", JSON.stringify(this.selectedFacilities));
    }
    params.append("reservation_id", this.data.idReservation);
    params.append("update_by", '1');
    const dialogRef = this.dialog.open(LoadingDialogComponent, { disableClose: true });
    const token = localStorage.getItem("token")
    const h = new HttpHeaders({ Authorization: "Bearer " + token });
    let options = { headers: h }
    this.client.post<any>(ApiLinks.updateReservation, params, options).subscribe({
      next: (result) => {
        console.log(result)
        if (result.code === 1) {
          this.dialogRef.close(result.reservation)
          return this.openSnackBar("Updated successfully", "Ok");
        } else {
          return this.openSnackBar(result.error, "Ok");
        }
      }, error: (error) => {
        console.log(error)
        return this.openSnackBar(error, "Ok");
      },
      complete: () => {
        dialogRef.close();
      }
    })
  }

  changeFacilitie(id: number) {
    const index = this.selectedFacilities.indexOf(id);
    if (index > -1) {
      this.selectedFacilities.splice(index, 1);
    } else {
      this.selectedFacilities.push(id);
    }
    console.log("selectedFacilities " + this.selectedFacilities);
    console.log("length " + this.selectedFacilities.length);
  }

  compareFacilities() {
    const facilityIds = JSON.parse(this.data.facility_ids);
    const selected = this.selectedFacilities;
    const areEqual = selected.length === facilityIds.length && selected.every(id => facilityIds.includes(id));
    if (!areEqual) {
      this.is_update_facility = 1;
    } else {
      this.is_update_facility = 0;
    }
  }

  getInfoRoom() {
    const independentRoom = AppComponent.rooms.find(r => r.id === this.data.room_id);
    if (independentRoom) {
      this.building_id = independentRoom.building_id;
      this.floor_id = independentRoom.floor_id;
      this.suite_id = independentRoom.suite_id;
      return;
    }

    for (const building of AppComponent.buildings) {
      for (const floor of building.floors) {
        for (const suite of floor.suites) {
          const suiteRoom = suite.rooms.find(r => r.id === this.data.room_id);
          if (suiteRoom) {
            this.building_id = suiteRoom.building_id;
            this.floor_id = suiteRoom.floor_id;
            this.suite_id = suiteRoom.suite_id;
            return;
          }
        }
      }
    }
    console.log("Room not found");
  }

  getFacilitieByRoom() {
    this.facilitie = [];
    const dialogRef = this.dialog.open(LoadingDialogComponent, { disableClose: true });
    const facilitiesArray = JSON.parse(this.data.facility_ids || "[]");
    let params = new FormData();
    params.append("building_id", this.building_id.toString());
    params.append("floor_id", this.floor_id.toString());
    params.append("suite_id", this.suite_id.toString());
    const token = localStorage.getItem("token");
    const h = new HttpHeaders({ Authorization: "Bearer " + token });
    let options = { headers: h };
    this.client.post<any>(ApiLinks.getFacilitieByRoom, params, options).subscribe({
      next: (result) => {
        console.log(result);
        if (result.code === 1) {
          this.facilitie = result.facilities.map((f: Facilitie) => ({
            ...f,
            isChecked: facilitiesArray.includes(f.id),
          }));
        } else {
          return this.openSnackBar(result.error, "Ok");
        }
      },
      error: (error) => {
        console.log(error);
        return this.openSnackBar(error, "Ok");
      },
      complete: () => {
        dialogRef.close();
      },
    });
  }

  onBuildingChange(buildingId: number | null) {
    const selectedBuilding = this.listBuilding.find(b => b.id === buildingId);
    if (selectedBuilding) {
      this.filteredFloors = selectedBuilding.floors || [];
      this.selectedFloorId = null;
      this.selectedFloorId = 'all';
    }
  }

  onFloorChange(floorId: any) {
    this.selectedFloorId = floorId === 'all' ? null : floorId;
    this.selectedFloorId = floorId;
  }

  selectRoom(room: Room) {
    this.selectedRoomId = room.id
    this.selectedRoomNumber = room.number;
  }

  toggleEditRoom() {
    this.editRoom = !this.editRoom;
  }

  toggleEditDate() {
    this.editDate = !this.editDate;
  }

  toggleEditFacility() {
    this.editFacility = !this.editFacility;
  }

  onCancel() {
    this.dialogRef.close()
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 6000,
      panelClass: ['custom-snackbar']
    });
  }
}
