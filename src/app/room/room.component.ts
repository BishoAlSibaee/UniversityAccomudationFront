import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent {
  @Input() roomData: any;
  @Input() isSelected: boolean | undefined;

  checkCapacity() {
    return this.roomData.capacity === 4 ? 'darkred' : 'gray';
  }
}
