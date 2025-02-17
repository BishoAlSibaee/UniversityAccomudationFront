import { Component } from '@angular/core';
import { translates } from '../translates';


@Component({
  selector: 'app-buildings-management',
  templateUrl: './buildings-management.component.html',
  styleUrls: ['./buildings-management.component.css'],
})

export class BuildingsManagementComponent {
  constructor() {
    translates.create()

  }
  ngOnInit() { }

  getTranslate(id: string) {
    return translates.getTranslate(id)
  }

}
