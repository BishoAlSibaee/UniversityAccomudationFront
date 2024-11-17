import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditAndAddStudentComponent } from './dialog-edit-and-add-student.component';

describe('DialogEditAndAddStudentComponent', () => {
  let component: DialogEditAndAddStudentComponent;
  let fixture: ComponentFixture<DialogEditAndAddStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEditAndAddStudentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogEditAndAddStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
