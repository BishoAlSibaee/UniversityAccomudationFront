import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Room } from '../Room';
import { Building } from '../Building';
import { Floor } from '../Floor';
import { Suite } from '../Suite';
import { ApiLinks } from '../ApiLinks';
import { AppComponent } from '../app.component';
import { LoadingDialogComponent } from '../loading-dialog/loading-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { College } from '../College';
import { DialogReservationComponent } from '../dialog-reservation/dialog-reservation.component';
import { Reservation } from '../Reservation';
import { RoomType } from '../RoomType';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
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
    this.getReservation();
    this.getAllRoomType()
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
      // console.log("NOT NULL");
      // console.log("Building  = " + AppComponent.buildings);
      // console.log("LENGTH APP = " + AppComponent.buildings.length);
      // console.log("===========================================");
      // console.log("length List Building IS : " + this.listBuilding.length);
      // console.log("Info Building list:", this.listBuilding);
      // console.log("===========================================");
      // console.log("length List Floor IS : " + this.listFloor.length);
      // console.log("Info Floor list:", this.listFloor);
      // console.log("===========================================");
      // console.log("length List Suites IS : " + this.listSuite.length);
      // console.log("Info Suites list:", this.listSuite);
      // console.log("===========================================");
      // console.log("length List ROOMS IS : " + this.listRooms.length);
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

  // openDialogReservaion(): void {
  //   this.dialog.open(DialogReservationComponent, {
  //     data: { roomId: this.selectedRoomId, roomNumber: this.selectedRoomNumber, roomCapacity: this.selectedRoomCapacity }
  //   });
  // }


  getReservation() {
    const dialogRef = this.dialog.open(LoadingDialogComponent, { disableClose: true });
    const token = localStorage.getItem("token")
    const h = new HttpHeaders({ Authorization: "Bearer " + token, });
    let options = { headers: h }
    this.client.get<Reservation[]>(ApiLinks.getReservation, options).subscribe({
      next: (result) => {
        this.listReservation = result
        console.log("Result = " + this.listReservation)
        console.log("Result length = " + this.listReservation.length)
        console.log("Result = " + result)
      }, error: (error) => {
        console.log(error)
      },
      complete: () => {
        dialogRef.close();
      }
    })
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
}


// console.log("length List Building IS : " + this.listBuilding.length);
// console.log("Info Building list:", this.listBuilding);
// console.log("===========================================");
// console.log("length List Floor IS : " + this.listFloor.length);
// console.log("Info Floor list:", this.listFloor);
// console.log("===========================================");
// console.log("length List Suites IS : " + this.listSuite.length);
// console.log("Info Suites list:", this.listSuite);
// console.log("===========================================");
// console.log("length List ROOMS IS : " + this.listRooms.length);
// console.log("Info Rooms list:", this.listRooms);
// console.log("===========================================");
// console.log("Info Rooms Of Sutie list:", this.listRoomsOfSuite);
