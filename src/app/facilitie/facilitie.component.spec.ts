import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilitieComponent } from './facilitie.component';

describe('FacilitieComponent', () => {
  let component: FacilitieComponent;
  let fixture: ComponentFixture<FacilitieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacilitieComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacilitieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
