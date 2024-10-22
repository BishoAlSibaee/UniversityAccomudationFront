import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditAndAddSuiteComponent } from './dialog-edit-and-add-suite.component';

describe('DialogEditAndAddSuiteComponent', () => {
  let component: DialogEditAndAddSuiteComponent;
  let fixture: ComponentFixture<DialogEditAndAddSuiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEditAndAddSuiteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogEditAndAddSuiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
