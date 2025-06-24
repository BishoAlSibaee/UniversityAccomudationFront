import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoorOpeningReportsComponent } from './door-opening-reports.component';

describe('DoorOpeningReportsComponent', () => {
  let component: DoorOpeningReportsComponent;
  let fixture: ComponentFixture<DoorOpeningReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoorOpeningReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoorOpeningReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
