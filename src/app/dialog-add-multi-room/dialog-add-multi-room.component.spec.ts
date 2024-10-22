import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddMultiRoomComponent } from './dialog-add-multi-room.component';

describe('DialogAddMultiRoomComponent', () => {
  let component: DialogAddMultiRoomComponent;
  let fixture: ComponentFixture<DialogAddMultiRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAddMultiRoomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAddMultiRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
