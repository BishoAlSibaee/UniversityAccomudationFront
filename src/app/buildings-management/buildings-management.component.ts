import { Component, ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'app-buildings-management',
  templateUrl: './buildings-management.component.html',
  styleUrls: ['./buildings-management.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class BuildingsManagementComponent {
  constructor() { }
  ngOnInit() {
    console.log("Enter BuildingsManagementComponent")
  }

}
