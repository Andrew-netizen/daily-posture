import { TestBed, inject } from '@angular/core/testing';
import { take } from 'rxjs/operators';
import { Exercise } from '../core/exercise.model';
import { ExerciseService } from './exercise.service';
describe('ExerciseService', () => {
  let service: ExerciseService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExerciseService],
    });
    service = TestBed.inject(ExerciseService);

    let store = {};
    const mockLocalStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear').and.callFake(mockLocalStorage.clear);
  });
  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should load default values', () => {
    service.exercises$.subscribe((exercises: Exercise[]) => {
      expect(exercises.length).toBe(5);
    });
  });

  it('should add an exercise', () => {
    const inputTitle: string = 'Do the Washing';
    const inputDescription: string = 'Wash the clothes';
    const input: Exercise = new Exercise(inputTitle, inputDescription);
    service.addExercise(input);

    service.exercises$.subscribe((exercises: Exercise[]) => {
      expect(exercises.length).toBe(6);
      var lastExercise = exercises[exercises.length - 1];
      expect(lastExercise.title).toBe(inputTitle);
      expect(lastExercise.description).toBe(inputDescription);
    });
  });

  it('should delete an exercise', () => {

    // Delete off the first exercise.
    service.exercises$.pipe(take(1)).subscribe((exercises: Exercise[]) => {
      service.deleteExercise(exercises[0]);
    });

    service.exercises$.subscribe((exercises: Exercise[]) => {
      expect(exercises.length).toBe(4);
    });

  });

  it('should update an exercise', () => {

    const exerciseIndex = 4;
    // Delete off the first exercise.
    const updatedTitle = 'Updated Title';
    const updatedDescription = 'Updated Description';

    service.updateExercise(new Exercise(updatedTitle, updatedDescription), exerciseIndex);

    service.exercises$.subscribe((exercises: Exercise[]) => {
      expect(exercises.length).toBe(5);
      const updatedExercise = exercises[exerciseIndex];
      expect(updatedExercise.title).toBe(updatedTitle);
      expect(updatedExercise.description).toBe(updatedDescription);
    });

  });


});
