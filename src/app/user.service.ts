import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userUpdated = new Subject<void>();
  private studentUpdated = new Subject<void>();
  userUpdated$ = this.userUpdated.asObservable();
  studentUpdated$ = this.studentUpdated.asObservable();
  refreshUserList() {
    this.userUpdated.next();
  }

  refreshStudentList() {
    this.studentUpdated.next();
  }
}
