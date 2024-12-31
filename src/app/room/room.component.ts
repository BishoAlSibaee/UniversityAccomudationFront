import { Component, Input } from '@angular/core';
import { translates } from '../translates';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent {
  @Input() roomData: any;
  @Input() isSelected: boolean | undefined;

  constructor() {
    translates.create()
  }

  checkCapacity() {
    return this.roomData.capacity === 4 ? 'darkred' : '#rgb(255 255 255)';
    // return this.roomData.capacity === 4 ? 'darkred' : '#bfbfbf';
  }

  getRoomType(idRoomType: number) {
    let name;
    const ro = AppComponent.roomType.find(r => r.id === idRoomType)
    console.log("roomData ")
    if (ro) {
      name = ro.name_ar
    }
    return name;
  }

  getTranslate(id: string) {
    return translates.getTranslate(id)
  }
}
