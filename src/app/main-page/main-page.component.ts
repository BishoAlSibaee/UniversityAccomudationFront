import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Room } from '../Room';
import { Building } from '../Building';
import { Floor } from '../Floor';
import { Suite } from '../Suite';
import { ApiLinks } from '../ApiLinks';
import { AppComponent } from '../app.component';
import { LoadingDialogComponent } from '../loading-dialog/loading-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Reservation } from '../Reservation';
import { RoomType } from '../RoomType';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';
import { UpdateReservationComponent } from '../update-reservation/update-reservation.component';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  private _snackBar = inject(MatSnackBar);
  LightColor = "#3d2706"
  studentsVisible
  roomsVisible
  listBuilding: Building[] = []
  listFloor: Floor[] = []
  listSuite: Suite[] = []
  listRooms: Room[] = []
  filteredRooms: Room[] = []
  listRoomsOfSuite: { [key: number]: Room[] } = {};
  filteredFloors: Floor[] = [];
  filteredSuites: Suite[] = [];
  listReservation: Reservation[] = []
  selectedRoomId: number | null = null;
  selectedRoomNumber: number | null = null;
  selectedRoomCapacity: number | null = null;
  selectedSuiteIndex: number | null = null;
  selectedBuildingName: any;
  selectedFloorName: string | Floor = 'all';
  static isAddingMode: boolean = false;


  constructor(private client: HttpClient, private router: Router, public dialog: MatDialog) {
    this.studentsVisible = true
    this.roomsVisible = false
  }

  ngOnInit() {
    this.getBuildingData();
    // this.getReservation();
    this.getAllRoomType();
    // this.getAllFacilitie();
  }

  getBuildingData() {
    if (AppComponent.buildings.length === 0) {
      const dialogRef = this.dialog.open(LoadingDialogComponent, { disableClose: true });
      let params = new FormData();
      const token = localStorage.getItem("token")

      const h = new HttpHeaders({
        Authorization: "Bearer " + token,
      });
      let options = { headers: h };

      this.client.post<any>(ApiLinks.getBuildingData, params, options).subscribe({
        next: (result) => {
          AppComponent.buildings = result.data;
          AppComponent.rooms = result.rooms;
          this.listBuilding = AppComponent.buildings;
          this.listRooms = AppComponent.rooms;
          this.addDataListsFromBuildings(this.listBuilding)
        },
        error: (error) => {
          console.log("Error");
          console.log(error);
        },
        complete: () => {
          dialogRef.close();
        }
      });
    } else {
      this.listBuilding = AppComponent.buildings
      this.listRooms = AppComponent.rooms
      this.addDataListsFromBuildings(this.listBuilding)
      console.log("Info Rooms list:", this.listRooms);
      AppComponent.rooms.forEach(room => {
        if (room.building_id == 55) {
          console.log("ROOMS1:", room);
        } else {
          console.log("not found");
        }
      })
    }
  }

  addDataListsFromBuildings(buildings: Building[]) {
    this.listFloor = [];
    this.listSuite = [];
    this.listRoomsOfSuite = {};

    buildings.forEach(building => {
      if (building.floors && building.floors.length) {
        this.listFloor.push(...building.floors);
      }
    });
    this.selectedBuildingName = buildings[0];

    this.listFloor.forEach(floor => {
      if (floor.suites && floor.suites.length) {
        this.listSuite.push(...floor.suites);
      }
    });

    this.listSuite.forEach(suite => {
      if (suite.rooms && suite.rooms.length) {
        this.listRoomsOfSuite[suite.id] = suite.rooms;
      } else {
        this.listRoomsOfSuite[suite.id] = [];
      }
    });

    if (buildings.length > 0) {
      this.onBuildingChange(buildings[0]);
    }


    // فائدة الفلتر رووم هون مشان يعرضلي فقط تبع المبنى ومايعرضلي كل الغرف الي عندي بالداتا
    this.filteredRooms = this.listRooms
      .filter(room => room.building_id === buildings[0].id && room.suite_id === 0)
      .sort((a, b) => {
        return a.number - b.number;
      });
  }

  students() {
    this.studentsVisible = true
    this.roomsVisible = false
  }

  rooms() {
    this.studentsVisible = false
    this.roomsVisible = true
  }

  goToShowStudents() {
    this.router.navigate(['students'])
  }

  goToMakeReservation() {
    this.router.navigate(['makeReservation'])
  }

  goToPage(namePage: string) {
    this.router.navigate([namePage]);
  }

  selectRoom(roomId: number, roomNumber: number, roomCapacity: number) {
    console.log("Room ID = " + roomId)
    this.selectedRoomId = roomId;
    this.selectedRoomNumber = roomNumber;
    this.selectedRoomCapacity = roomCapacity
    // const dialogRef = this.dialog.open(LoadingDialogComponent, { disableClose: true });
    let params = new FormData();
    params.append("roomId", roomId.toString());
    const token = localStorage.getItem("token")
    const h = new HttpHeaders({ Authorization: "Bearer " + token, });
    let options = { headers: h }
    this.client.post<any>(ApiLinks.getReservationByRoom, params, options).subscribe({
      next: (result) => {
        console.log(result)
        if (result.code === 1) {
          AppComponent.reservations = []
          this.listReservation = []
          AppComponent.reservations = result.reservations
          this.listReservation = AppComponent.reservations
          console.log(this.listReservation.length)
          console.table(this.listReservation)
          console.table(AppComponent.reservations)
        } else {
          return this.openSnackBar(result.error, "Ok");
        }
      }, error: (error) => {
        console.log(error)
        return this.openSnackBar(error, "Ok");
      },
      // complete: () => {
      //   dialogRef.close();
      // }
    })
  }

  selectSuite(index: number) {
    this.selectedSuiteIndex = index;
  }

  onBuildingChange(selectedBuilding: Building) {
    this.listFloor = [];
    this.listSuite = [];
    this.filteredRooms = [];
    this.filteredSuites = [];
    this.listRoomsOfSuite = {};

    if (selectedBuilding.floors && selectedBuilding.floors.length > 0) {
      console.log("Building has floors:", selectedBuilding.floors);
      this.filteredFloors = selectedBuilding.floors;
      selectedBuilding.floors.forEach(floor => {
        if (floor.suites && floor.suites.length) {
          this.listSuite.push(...floor.suites);
        }
      });
      this.listSuite.forEach(suite => {
        if (suite.rooms && suite.rooms.length) {
          this.listRoomsOfSuite[suite.id] = suite.rooms;
        } else {
          this.listRoomsOfSuite[suite.id] = [];
        }
      });
      this.filteredSuites = this.listSuite.filter(suite => suite.building_id === selectedBuilding.id)
      this.filteredRooms = this.listRooms.filter(room => room.building_id === selectedBuilding.id && room.suite_id === 0);
    } else {
      console.log("No floors found for the selected building");
      this.filteredFloors = [];
    }
  }

  onFloorChange(selectedFloor: any) {
    console.log("Selected Floor:", selectedFloor);
    this.filteredSuites = [];
    this.filteredRooms = [];

    if (selectedFloor === 'all') {
      console.log("Selected ALL");
      const currentBuildingId = this.selectedBuildingName.id;
      this.filteredSuites = this.listSuite;
      this.filteredRooms = this.listRooms.filter(room => room.suite_id === 0 && room.building_id === currentBuildingId);
    } else if (selectedFloor) {
      console.log("Selected FLOOR");
      this.filteredSuites = this.listSuite.filter(suite => suite.floor_id === selectedFloor.id);
      this.filteredRooms = this.listRooms.filter(room => room.floor_id === selectedFloor.id && room.suite_id === 0);
    }
  }

  getBuildingName(buildingId: number): string {
    const building = this.listBuilding.find(b => b.id === buildingId);
    return building ? building.name : 'Unknown Building';
  }

  goBuildingManagement(page: string) {
    MainPageComponent.isAddingMode = (page === 'BuildingsManagement');
    this.router.navigate([page]);
  }

  // getReservation() {
  //   const dialogRef = this.dialog.open(LoadingDialogComponent, { disableClose: true });
  //   const token = localStorage.getItem("token")
  //   const h = new HttpHeaders({ Authorization: "Bearer " + token, });
  //   let options = { headers: h }
  //   this.client.get<Reservation[]>(ApiLinks.getReservation, options).subscribe({
  //     next: (result) => {
  //       this.listReservation = result
  //       console.log("Result = " + this.listReservation)
  //       console.log("Result length = " + this.listReservation.length)
  //       console.log("Result = " + result)
  //     }, error: (error) => {
  //       console.log(error)
  //     },
  //     complete: () => {
  //       dialogRef.close();
  //     }
  //   })
  // }

  // getAllFacilitie() {
  //   const dialogRef = this.dialog.open(LoadingDialogComponent, { disableClose: true });
  //   const token = localStorage.getItem("token")
  //   const h = new HttpHeaders({ Authorization: "Bearer " + token });
  //   let options = { headers: h };
  //   this.client.get<Facilitie[]>(ApiLinks.getFacilitie, options).subscribe({
  //     next: (result) => {
  //       AppComponent.facilitie = result
  //       console.table(AppComponent.facilitie);
  //       // this.facilitie = AppComponent.facilitie
  //     },
  //     error: (error) => {
  //       console.log("Error");
  //       console.log(error);
  //     },
  //     complete: () => {
  //       dialogRef.close();
  //     }
  //   });
  // }

  getAllRoomType() {
    const token = localStorage.getItem("token")
    const h = new HttpHeaders({
      Authorization: "Bearer " + token,
    });
    let options = { headers: h };
    this.client.get<RoomType[]>(ApiLinks.getAllRoomType, options).subscribe({
      next: (result) => {
        AppComponent.roomType = result
      },
      error: (error) => {
        console.log("Error");
        console.log(error);
      },
    });
  }

  openDeleteDialog(id: number, name: string): void {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      data: { id: id, name: name }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'ok') {
        const reservationIndex = this.listReservation.findIndex(r => r.id === id);
        if (reservationIndex != -1) {
          this.listReservation.splice(reservationIndex, 1)
        }
      } else {
        console.log('Deletion cancelled');
      }
    });
  }

  openUpdateReservationDialog(idReservation: number, nameUser: string, room_id: number, room_number: string, start_date: string, expire_date: string, facility_ids: any, buildingName: string): void {
    const dialogRef = this.dialog.open(UpdateReservationComponent, {
      data: { idReservation: idReservation, nameUser: nameUser, room_id: room_id, room_number: room_number, start_date: start_date, expire_date: expire_date, facility_ids: facility_ids, buildingName: buildingName },
      panelClass: ['dialog-panel']
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.table(result)
        console.log(result.id)
        console.log(result.student_name)
        const res = this.listReservation.find(r => r.id === idReservation)
        console.table(result)
        if (res) {
          res.room_id = Number(result.room_id)
          res.room_number = result.room_number
          res.start_date = result.start_date
          res.expire_date = result.expire_date
          res.facility_ids = result.facility_ids
          console.log('result.id ' + result.room_id);
        }
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 6000,
      panelClass: ['custom-snackbar']
    });
  }
}
