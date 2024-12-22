import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddFacilitieComponent } from './dialog-add-facilitie.component';

describe('DialogAddFacilitieComponent', () => {
  let component: DialogAddFacilitieComponent;
  let fixture: ComponentFixture<DialogAddFacilitieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAddFacilitieComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAddFacilitieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
