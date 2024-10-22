import { Component, Input } from '@angular/core';
import { Suite } from '../Suite';

@Component({
  selector: 'app-suite',
  templateUrl: './suite.component.html',
  styleUrls: ['./suite.component.css']
})
export class SuiteComponent {

  @Input() suiteData: any;
  @Input() roomsOfSuite: any[] = [];
  @Input() isSelected: boolean | undefined;
  selectedRoomIndex: number | null = null;

  selectRoom(index: number) {
    this.selectedRoomIndex = index;
  }
}
