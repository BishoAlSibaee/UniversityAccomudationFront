import { Component } from '@angular/core';
import { translates } from '../translates';

@Component({
  selector: 'app-reservation-management',
  templateUrl: './reservation-management.component.html',
  styleUrls: ['./reservation-management.component.css']
})
export class ReservationManagementComponent {
  constructor() {
    translates.create()
  }

  getTranslate(id: string) {
    return translates.getTranslate(id)
  }

}
