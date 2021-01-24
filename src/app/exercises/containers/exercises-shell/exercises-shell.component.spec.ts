import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { ExerciseService } from 'src/app/services/exercise.service';
import { ExercisesListComponent } from '../../components/exercises-list/exercises-list.component';
import { ExercisesRowComponent } from '../../components/exercises-row/exercises-row.component';

import { ExercisesShellComponent } from './exercises-shell.component';

describe('ExercisesShellComponent', () => {
  let component: ExercisesShellComponent;
  let fixture: ComponentFixture<ExercisesShellComponent>;
  let mockExerciseService;
  let mockExerciseContent$ = new BehaviorSubject([
    { title: 'Grab', description: 'Grab your backside' },
    { title: 'Bird Dog', description: 'Do 12 bird dog exercises' },
  ]);

  let service: ExerciseService;

  beforeEach(async () => {
    mockExerciseService = jasmine.createSpyObj(['deleteExercise']);
    mockExerciseService.exercises$ = mockExerciseContent$;

    await TestBed.configureTestingModule({
      declarations: [
        ExercisesShellComponent,
        ExercisesRowComponent,
        ExercisesListComponent,
      ],
      providers: [{ provide: ExerciseService, useValue: mockExerciseService }],
    }).compileComponents();

    service = TestBed.inject(ExerciseService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExercisesShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load exercises from the exercise service', () => {
    const exerciseRows = fixture.debugElement.queryAll(
      By.directive(ExercisesRowComponent)
    );
    expect(exerciseRows.length).toBe(2);
  });
});
