import { Component, inject } from '@angular/core';
import { Building } from '../Building';
import { Floor } from '../Floor';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { RoomType } from '../RoomType';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiLinks } from '../ApiLinks';
import { LoadingDialogComponent } from '../loading-dialog/loading-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Room } from '../Room';
import { Reservation } from '../Reservation';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { DialogReservationComponent } from '../dialog-reservation/dialog-reservation.component';

@Component({
  selector: 'app-make-reservation',
  templateUrl: './make-reservation.component.html',
  styleUrls: ['./make-reservation.component.css'],
  animations: [
    trigger('slideToggle', [
      state('void', style({ height: '0', opacity: '0', overflow: 'hidden' })),
      state('*', style({ height: '*', opacity: '1', overflow: 'visible' })),
      transition(':enter', [animate('300ms ease-out')]),
      transition(':leave', [animate('300ms ease-in')]),
    ]),
  ],
})

export class MakeReservationComponent {
  private _snackBar = inject(MatSnackBar);
  buildings: Building[] = [];
  selectedBuildingId: number = 0;
  filteredFloors: Floor[] = [];
  selectedFloorId: string | number | null = 'all';
  capacities: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  selectedCapacity: string | number | null = 'all';
  roomTypes: RoomType[] = [];
  selectedRoomTypeId: string | number | null = 'all';
  selectedOption: number = 0;
  selectedRoom: any = null;
  selectedRoomNumber: number | null = null;
  startDate: string = '';
  expirDate: string = '';
  availableRooms: Room[] = []
  reservations: Reservation[] = []
  showOptions: boolean = false;
  Start: any
  Expire: any
  userReservations: Reservation[] = [];

  constructor(private router: Router, private client: HttpClient, private dialog: MatDialog) { }

  ngOnInit() {
    this.buildings = AppComponent.buildings;
    if (this.buildings.length === 0) {
      this.router.navigate(['/mainPage']);
    } else {
      this.selectedBuildingId = this.buildings[0].id;
      this.roomTypes = AppComponent.roomType;
      this.onBuildingChange(this.selectedBuildingId);
    }
  }

  onBuildingChange(buildingId: number | null) {
    const selectedBuilding = this.buildings.find(b => b.id === buildingId);
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

  onRoomTypeChange(roomTypeId: number | null) {
    this.selectedRoomTypeId = roomTypeId;
  }

  selectRoom(room: Room) {
    if (this.userReservations.length > 0) {
      return this.openSnackBar("لا يمكن تغيير الغرفة بعد اضافة الحجز", "Ok");
    }
    this.selectedRoom = room;
    this.selectedRoomNumber = room.number;
  }

  checkReservation() {
    let StartDate = new Date(this.startDate)
    let ExpireDate = new Date(this.expirDate)
    this.Start = StartDate.getFullYear() + "-" + (StartDate.getMonth() + 1) + "-" + StartDate.getDate()
    this.Expire = ExpireDate.getFullYear() + "-" + (ExpireDate.getMonth() + 1) + "-" + ExpireDate.getDate()

    if (this.selectedBuildingId === 0) {
      return this.openSnackBar("All Required", "Ok");
    }
    if (this.startDate === '' || this.expirDate === '') {
      return this.openSnackBar("Enter Date", "Ok");
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
    if (this.selectedRoomTypeId != null && this.selectedRoomTypeId !== 'all') {
      params.append("room_type", this.selectedRoomTypeId.toString());
    }
    if (this.selectedCapacity != null && this.selectedCapacity !== 'all') {
      params.append("capacity", this.selectedCapacity.toString());
    }
    params.append("start_date", this.Start);
    params.append("expire_date", this.Expire);
    params.append("type_search", this.selectedOption.toString());
    const token = localStorage.getItem("token")
    const h = new HttpHeaders({ Authorization: "Bearer " + token, });
    let options = { headers: h }
    this.selectedRoomNumber = 0
    this.userReservations = [];
    this.availableRooms = [];
    this.reservations = [];
    this.selectedRoom = null;
    this.client.post<any>(ApiLinks.checkReservation, params, options).subscribe({
      next: (result) => {
        console.log(result)
        if (result.code === 1) {
          this.availableRooms = result.AvailableRooms
          this.availableRooms.sort((a, b) => { return a.number - b.number; });
          console.log("result = " + result.AvailableRooms)
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

  makeReservation() {
    console.table(this.userReservations);
    const dialogRef = this.dialog.open(LoadingDialogComponent, { disableClose: true });
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({ Authorization: "Bearer " + token });
    const options = { headers: headers };
    const params = { Reservations: this.userReservations };
    this.client.post<any>(ApiLinks.makeReservation, params, options).subscribe({
      next: (result) => {
        if (result.code === 1) {
          this.openSnackBar("تم الحجز بنجاح", "Ok");
          this.clearDataAfterReservation();
        } else {
          this.openSnackBar(result.error, "Ok");
        }
      },
      error: (error) => {
        console.error(error);
        this.openSnackBar("حدث خطأ أثناء محاولة الاتصال بالخادم.", "Ok");
      },
      complete: () => {
        dialogRef.close();
      },
    });
  }

  openReservationComponent(roomId: number, roomNumber: number, building_id: number, floor_id: number, suite_id: number, availableCapacity: number, startDate: string, endDate: string): void {
    if (this.userReservations.length >= availableCapacity) {
      return this.openSnackBar("لا يمكن الأضافة .. عدد الأفراد أكبر من سعة الغرفة", "Ok");
    } else {
      const dialogRef = this.dialog.open(DialogReservationComponent, {
        data: { roomId, roomNumber, building_id, floor_id, suite_id, startDate, endDate }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          result.forEach((res: any) => {
            if (this.isStudentAlreadyReserved(res.student_id)) {
              this.openSnackBar(`الحجز موجود مسبقًا للطالب: ${res.student_name}`, "Ok");
            } else {
              console.table(res);
              this.userReservations.push(res);
              // res.facility_ids = [];
            }
          });
        }
      });
    }
  }

  checkList() {
    console.table(this.userReservations);
    this.reservations.forEach((reservation, index) => {
      console.log(`Reservation ${index + 1}:`, this.userReservations);
    });
    console.log("Reservation length  = " + this.userReservations.length)
    console.log("Reservations:", JSON.stringify(this.userReservations, null, 2));
  }

  deleteReservation(index: number) {
    this.userReservations.splice(index, 1);
  }

  isStudentAlreadyReserved(studentId: number): boolean {
    const isInCurrentReservations = this.selectedRoom.reservations.some(
      (res: any) => res.student_id === studentId
    );
    const isInUserReservations = this.userReservations.some(
      (res) => res.student_id === studentId
    );
    return isInCurrentReservations || isInUserReservations;
  }

  toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  clearDataAfterReservation() {
    this.selectedOption = 0
    this.selectedRoom = null
    this.selectedRoomNumber = null
    this.startDate = ''
    this.expirDate = ''
    this.availableRooms = [];
    this.reservations = []
    this.userReservations = []
    this.showOptions = false
    this.Start = null
    this.Expire = null
  }

  getFacilitiesById(id: number) {
    let name;
    AppComponent.facilitie.forEach(f => {
      if (f.id === id) {
        name = f.name_ar
      }
    })
    return name;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 6000,
      panelClass: ['custom-snackbar']
    });
  }
}
