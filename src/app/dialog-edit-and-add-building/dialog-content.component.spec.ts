import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditAndAddBuilding } from './dialog-edit-and-add-building.component';

describe('DialogEditAndAddBuilding', () => {
  let component: DialogEditAndAddBuilding;
  let fixture: ComponentFixture<DialogEditAndAddBuilding>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEditAndAddBuilding ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogEditAndAddBuilding);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
