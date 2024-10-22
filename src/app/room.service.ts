import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private roomListUpdated = new Subject<void>();
  private floorListUpdated = new Subject<void>();
  private suiteListUpdated = new Subject<void>();
  roomListUpdated$ = this.roomListUpdated.asObservable();
  floorListUpdated$ = this.floorListUpdated.asObservable();
  suiteListUpdated$ = this.suiteListUpdated.asObservable();
  refreshRoomList() {
    this.roomListUpdated.next();
  }
  refreshFloorList() {
    this.floorListUpdated.next();
  }
  refreshSuiteList() {
    this.suiteListUpdated.next();
  }
}
