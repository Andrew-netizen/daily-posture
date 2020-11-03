import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExercisesRowComponent } from './exercises-row.component';

describe('ExercisesRowComponent', () => {
  let component: ExercisesRowComponent;
  let fixture: ComponentFixture<ExercisesRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExercisesRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExercisesRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
