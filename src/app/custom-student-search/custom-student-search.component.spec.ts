import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomStudentSearchComponent } from './custom-student-search.component';

describe('CustomStudentSearchComponent', () => {
  let component: CustomStudentSearchComponent;
  let fixture: ComponentFixture<CustomStudentSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomStudentSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomStudentSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
