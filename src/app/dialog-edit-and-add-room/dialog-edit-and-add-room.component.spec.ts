import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditAndAddRoomComponent } from './dialog-edit-and-add-room.component';

describe('DialogEditAndAddRoomComponent', () => {
  let component: DialogEditAndAddRoomComponent;
  let fixture: ComponentFixture<DialogEditAndAddRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEditAndAddRoomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogEditAndAddRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
