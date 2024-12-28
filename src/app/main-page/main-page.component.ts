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
import { Facilitie } from '../Facilitie';

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
  filteredFloors: Floor[] = [];
  listReservation: Reservation[] = []
  facilitie: Facilitie[] = []
  myFacilitie: Facilitie[] = []
  selectedRoomId: number | null = null;
  selectedRoomNumber: number | null = null;
  selectedRoomCapacity: number | null = null;
  selectedSuiteIndex: number | null = null;
  selectedBuildingName: any;
  selectedFloorName: string | Floor = 'all';
  static isAddingMode: boolean = false;
  isBack: boolean = false;
  nameUser: string = ''
  showDropdown = false;
  floorNumber: number = 0;
  buildingName: string = ''
  constructor(private client: HttpClient, private router: Router, public dialog: MatDialog) {
    this.studentsVisible = true
    this.roomsVisible = false
  }

  ngOnInit() {
    this.getBuildingData();
    this.getAllRoomType();
    this.getAllFacilitie();
    this.nameUser = localStorage.getItem("userName") || ''
  }

  getBuildingData() {
    this.isBack = false
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
          this.isBack = true
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
      this.listBuilding = [];
      this.listRooms = [];
      this.filteredRooms = []
      this.listBuilding = AppComponent.buildings
      this.listRooms = AppComponent.rooms
      this.addDataListsFromBuildings(this.listBuilding)
      this.filteredRooms = this.listRooms
        .filter(room => room.building_id === this.listBuilding[0].id)
        .sort((a, b) => {
          return a.number - b.number;
        });
      console.log("Info Rooms list:", this.listRooms);
    }

  }

  addDataListsFromBuildings(buildings: Building[]) {
    this.listFloor = [];
    this.listSuite = [];
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
    if (this.isBack) {
      this.listSuite.forEach(suite => {
        if (suite.rooms && suite.rooms.length) {
          suite.rooms.forEach(room => {
            console.log("room = " + room.number + " " + room.building_id)
            this.listRooms.push(room);
          });
        }
      });

      if (buildings.length > 0) {
        this.onBuildingChange(buildings[0]);
      }
      this.filteredRooms = this.listRooms
        .filter(room => room.building_id === buildings[0].id)
        .sort((a, b) => {
          return a.number - b.number;
        });
    }
    if (buildings.length > 0) {
      this.onBuildingChange(buildings[0]);
    }
  }

  onBuildingChange(selectedBuilding: Building) {
    // this.buildingName = selectedBuilding.name
    this.listFloor = [];
    this.listSuite = [];
    if (selectedBuilding.floors && selectedBuilding.floors.length > 0) {
      this.filteredFloors = selectedBuilding.floors;
      selectedBuilding.floors.forEach(floor => {
        if (floor.suites && floor.suites.length) {
          this.listSuite.push(...floor.suites);
        }
      });
      this.filteredRooms = this.listRooms.filter(room => room.building_id === selectedBuilding.id).sort((a, b) => {
        return a.number - b.number;
      });
    } else {
      console.log("No floors found for the selected building");
      this.filteredFloors = [];
    }
  }

  onFloorChange(selectedFloor: any) {
    console.log("Selected Floor:", selectedFloor);
    this.filteredRooms = [];
    if (selectedFloor === 'all') {
      console.log("Selected ALL");
      const currentBuildingId = this.selectedBuildingName.id;
      this.filteredRooms = this.listRooms.filter(room => room.building_id === currentBuildingId).sort((a, b) => {
        return a.number - b.number;
      });
    } else if (selectedFloor) {
      console.log("Selected FLOOR");
      this.filteredRooms = this.listRooms.filter(room => room.floor_id === selectedFloor.id).sort((a, b) => {
        return a.number - b.number;
      });
    }
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

  selectRoom(roomId: number, roomNumber: number, roomCapacity: number, floor_id: number, building_id: number) {
    this.selectedRoomId = roomId;
    this.selectedRoomNumber = roomNumber;
    this.selectedRoomCapacity = roomCapacity
    const building = this.listBuilding.find(b => b.id === building_id)
    if (building) {
      this.buildingName = building.name
    }
    const floor = this.listBuilding.flatMap(b => b.floors).find(f => f.id === floor_id);
    if (floor) {
      this.floorNumber = floor.number;
    }
    this.getReservationByRoom(roomId)
  }

  getReservationByRoom(roomId: number) {
    let params = new FormData();
    params.append("roomId", roomId.toString());
    const token = localStorage.getItem("token");
    const h = new HttpHeaders({ Authorization: "Bearer " + token });
    let options = { headers: h };

    this.client.post<any>(ApiLinks.getReservationByRoom, params, options).subscribe({
      next: (result) => {
        console.log(result);
        console.log("Enter Function");
        if (result.code === 1) {
          AppComponent.reservations = [];
          this.listReservation = [];
          AppComponent.reservations = result.reservations;
          this.listReservation = AppComponent.reservations;

          this.listReservation.forEach((reservation) => {
            let facilityIds: number[] = [];
            if (typeof reservation.facility_ids === "string") {
              try {
                facilityIds = JSON.parse(reservation.facility_ids);
                console.log(facilityIds);

              } catch (error) {
                console.error(`Error parsing facility_ids for reservation ID: ${reservation.id}`, error);
              }
            }
            if (facilityIds.length > 0) {
              let myFacilitie: string[] = [];
              facilityIds.forEach((facilityId: number) => {
                console.log(facilityIds);
                const matchedFacility = this.facilitie.find(f => f.id === facilityId);
                if (matchedFacility) {
                  myFacilitie.push(matchedFacility.name_ar);
                  reservation.facility_name = myFacilitie;
                }
              });
            }

          });
        } else {
          return this.openSnackBar(result.error, "Ok");
        }
      },
      error: (error) => {
        console.log(error);
        return this.openSnackBar(error, "Ok");
      },
    });
  }

  selectSuite(index: number) {
    this.selectedSuiteIndex = index;
  }


  getBuildingName(buildingId: number): string {
    const building = this.listBuilding.find(b => b.id === buildingId);
    return building ? building.name : 'Unknown Building';
  }

  goBuildingManagement(page: string) {
    MainPageComponent.isAddingMode = (page === 'BuildingsManagement');
    this.router.navigate([page]);
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
          //[7,8,9,10]
          res.room_id = Number(result.room_id)
          res.room_number = result.room_number
          res.start_date = result.start_date
          res.expire_date = result.expire_date
          res.facility_ids = result.facility_ids
          console.log(res.facility_ids);

          // if (typeof res.facility_ids === "string") {
          //   try {
          //     res.facility_ids = JSON.parse(res.facility_ids);
          //   } catch (error) {
          //     console.error(`Error parsing facility_ids for reservation ID: ${res.id}`, error);
          //     res.facility_ids = [];
          //   }
          // }

          // if (Array.isArray(res.facility_ids)) {
          //   res.facility_ids.forEach((facilityId: number) => {
          //     const matchedFacility = this.facilitie.find(f => f.id === facilityId);
          //     if (matchedFacility) {
          //       res.facility_name?.push(matchedFacility.name_ar);
          //     }
          //   });
          // } else {
          //   console.error(`facility_ids is not an array for reservation ID: ${res.id}`);
          // }


          // if (typeof res.facility_ids === "string") {
          //   try {
          //     JSON.parse(res.facility_ids);
          //   } catch (error) {
          //     console.error(`Error parsing facility_ids for reservation ID: `, error);
          //   }
          // }

          // res.facility_ids.forEach((facilityId: number) => {
          //   const matchedFacility = this.facilitie.find(f => f.id === facilityId);
          //   if (matchedFacility) {
          //     res.facility_name?.push(matchedFacility.name_ar)
          //   }
          // });
        }
      }
    });
  }

  logOut() {
    const dialogRef = this.dialog.open(LoadingDialogComponent, { disableClose: true });
    localStorage.clear();
    setTimeout(() => {
      this.goToPage('login');
      dialogRef.close();
    }, 1000);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 6000,
      panelClass: ['custom-snackbar']
    });
  }
}
