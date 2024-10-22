import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditAndAddFloorComponent } from './dialog-edit-and-add-floor.component';

describe('DialogEditAndAddFloorComponent', () => {
  let component: DialogEditAndAddFloorComponent;
  let fixture: ComponentFixture<DialogEditAndAddFloorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEditAndAddFloorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogEditAndAddFloorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
