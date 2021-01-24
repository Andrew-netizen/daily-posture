import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Exercise } from 'src/app/core/exercise.model';

import { ExercisesRowComponent } from './exercises-row.component';

describe('ExercisesRowComponent', () => {
  let component: ExercisesRowComponent;
  let fixture: ComponentFixture<ExercisesRowComponent>;
  let exercise: Exercise;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExercisesRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    exercise = new Exercise('Title', 'Description');
    fixture = TestBed.createComponent(ExercisesRowComponent);
    component = fixture.componentInstance;
    component.exercise = exercise;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
