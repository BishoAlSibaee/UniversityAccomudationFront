import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetReservationByStudentComponent } from './get-reservation-by-student.component';

describe('GetReservationByStudentComponent', () => {
  let component: GetReservationByStudentComponent;
  let fixture: ComponentFixture<GetReservationByStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetReservationByStudentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetReservationByStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
