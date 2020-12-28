import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { Exercise } from '../core/exercise.model';
import { ExercisesSettingsState } from '../core/exercises-settings.state';
import { ExercisesSettingsStore } from '../core/exercises-settings.store';

const exercisesKey: string = 'DAILY_POSTURE_EXERCISE_LIST';

class UpdatedExerciseInformation {
  constructor(public exercise: Exercise, public index: number) {}
}

@Injectable({
  providedIn: 'root',
})
export class ExerciseService implements OnDestroy {
  private exerciseIndex$ = new BehaviorSubject<number>(0);
  private exercisesSettingsStore: ExercisesSettingsStore;

  private exerciseToAdd$ = new BehaviorSubject<Exercise | null>(null);
  private exerciseToDelete$ = new BehaviorSubject<Exercise | null>(null);
  private exerciseToUpdate$ = new BehaviorSubject<UpdatedExerciseInformation | null>(
    null
  );
  private exerciseCycled$ = new BehaviorSubject<boolean>(false);

  private exerciseCycledSubscription: Subscription;
  private exerciseToAddSubscription: Subscription;
  private exerciseToDeleteSubscription: Subscription;
  private exerciseToUpdateSubscription: Subscription;

  public nextExercise$: Observable<Exercise>;

  get exercises$(): Observable<Exercise[]> {
    if (this.exercisesSettingsStore)
      return this.exercisesSettingsStore.exercises$;
  }

  constructor() {
    var stateSetFromLocalStorage: boolean = false;

    const localStorageExercisesText = localStorage.getItem(exercisesKey);
    if (localStorageExercisesText) {
      let localStorageExercisesState = ExercisesSettingsState.fromJSON(
        localStorageExercisesText
      );
      if (localStorageExercisesState instanceof ExercisesSettingsState) {
        this.exercisesSettingsStore = new ExercisesSettingsStore();
        this.exercisesSettingsStore.setState(localStorageExercisesState);
        stateSetFromLocalStorage = true;
      }
    }

    if (!stateSetFromLocalStorage) {
      let state = new ExercisesSettingsState(this.defaultExercises());
      this.exercisesSettingsStore = new ExercisesSettingsStore();
      this.saveExercises(state);
    }

    this.exerciseToDeleteSubscription = this.exerciseToDelete$
      .pipe(
        withLatestFrom(this.exercises$, this.exerciseIndex$),
        map(([deletedExercise, exercises, exerciseIndex]) => {
          if (exercises && deletedExercise) {
            var result = exercises.filter((item) => item != deletedExercise);
            if (exerciseIndex != null && exerciseIndex >= result.length) {
              this.exerciseIndex$.next(result.length - 1);
            }
            return result;
          }
        })
      )
      .subscribe((result) => {
        if (result) {
          const deletedExerciseState = new ExercisesSettingsState(result);
          this.saveExercises(deletedExerciseState);
        }
      });

    this.exerciseToAddSubscription = this.exerciseToAdd$
      .pipe(
        withLatestFrom(this.exercises$),
        map(([addedExercise, exercises]) => {
          if (exercises && addedExercise) {
            exercises.push(addedExercise);
            return exercises;
          }
        })
      )
      .subscribe((value) => {
        if (value) {
          const newState = new ExercisesSettingsState(value);
          this.saveExercises(newState);
        }
      });

    this.exerciseToUpdateSubscription = this.exerciseToUpdate$
      .pipe(
        withLatestFrom(this.exercises$),
        map(([updatedExercise, exercises]) => {
          if (exercises && updatedExercise) {
            exercises[updatedExercise.index] = updatedExercise.exercise;
            return exercises;
          }
        })
      )
      .subscribe((value) => {
        if (value) {
          const updatedExerciseState = new ExercisesSettingsState(value);
          this.saveExercises(updatedExerciseState);
        }
      });

    this.nextExercise$ = combineLatest([
      this.exercisesSettingsStore.exercises$,
      this.exerciseIndex$,
    ]).pipe(
      map(([exercisesList, index]) => {
        if (exercisesList) return exercisesList[index];
      })
    );

    this.exerciseCycledSubscription = this.exerciseCycled$
      .pipe(
        withLatestFrom(this.exercises$, this.exerciseIndex$),
        map(([exerciseCycled, exercises, exerciseIndex]) => {
          if (exerciseCycled && exercises && exerciseIndex != null) {
            if (exerciseIndex + 1 < exercises.length) return exerciseIndex + 1;
            else return 0;
          }
        })
      )
      .subscribe((value) => {
        if (value != null) {
          this.exerciseIndex$.next(value);
        }
      });
  }

  ngOnDestroy(): void {
    this.exerciseCycledSubscription.unsubscribe();
    this.exerciseToAddSubscription.unsubscribe();
    this.exerciseToDeleteSubscription.unsubscribe();
    this.exerciseToUpdateSubscription.unsubscribe();
  }

  addExercise(exercise: Exercise): void {
    this.exerciseToAdd$.next(exercise);
  }

  cycleNextExercise(): void {
    this.exerciseCycled$.next(true);
  }

  defaultExercises(): Exercise[] {
    return [
      new Exercise('Grab', 'Stand up and grab your backside for 20 seconds'),
      new Exercise('Reverse Lunges', 'Do 10 reverse lunges'),
      new Exercise('Bird Dog', 'Do 12 bird dog exercises'),
      new Exercise('Thread the Needle', 'Do 10 lots of thread the needle'),
      new Exercise('Pigeon Stretch', 'Do 5 pigeon stretches on each leg'),
    ];
  }

  deleteExercise(exercise: Exercise): void {
    this.exerciseToDelete$.next(exercise);
  }

  saveExercises(exercisesSettingsState: ExercisesSettingsState) {
    this.exercisesSettingsStore.setState(exercisesSettingsState);
    localStorage.setItem(
      exercisesKey,
      JSON.stringify(exercisesSettingsState.toJSON())
    );
  }

  updateExercise(exercise: Exercise, index: number): void {
    const exerciseUpdateInfo = new UpdatedExerciseInformation(exercise, index);
    this.exerciseToUpdate$.next(exerciseUpdateInfo);
  }
}
