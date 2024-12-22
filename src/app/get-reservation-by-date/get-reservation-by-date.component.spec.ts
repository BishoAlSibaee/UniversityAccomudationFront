import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetReservationByDateComponent } from './get-reservation-by-date.component';

describe('GetReservationByDateComponent', () => {
  let component: GetReservationByDateComponent;
  let fixture: ComponentFixture<GetReservationByDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetReservationByDateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetReservationByDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
