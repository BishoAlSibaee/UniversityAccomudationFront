import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogReservationComponent } from './dialog-reservation.component';

describe('DialogReservationComponent', () => {
  let component: DialogReservationComponent;
  let fixture: ComponentFixture<DialogReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogReservationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
