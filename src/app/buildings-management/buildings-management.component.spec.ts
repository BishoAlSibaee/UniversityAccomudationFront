import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingsManagementComponent } from './buildings-management.component';

describe('BuildingsManagementComponent', () => {
  let component: BuildingsManagementComponent;
  let fixture: ComponentFixture<BuildingsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuildingsManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildingsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
