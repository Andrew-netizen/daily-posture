import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { Exercise } from '../core/exercise.model';
import { ExercisesSettingsState } from '../core/exercises-settings.state';
import { ExercisesSettingsStore } from '../core/exercises-settings.store';

const exercisesKey: string = 'DAILY_POSTURE_EXERCISE_LIST';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService implements OnDestroy {

  private exerciseIndex: number = 0;
  private exerciseIndex$ = new BehaviorSubject<number>(0);
  private exerciseCount: number;
  private exerciseToDelete$ = new BehaviorSubject<Exercise | null>(null);
  private exerciseToAdd$ = new BehaviorSubject<Exercise | null>(null);
  private exercisesSettingsStore: ExercisesSettingsStore;

  private exerciseToDeleteSubscription: Subscription;
  private exerciseToAddSubscription: Subscription;

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
        this.exerciseCount = localStorageExercisesState.Exercises.length;
        stateSetFromLocalStorage = true;
      }
    }

    if (!stateSetFromLocalStorage) {
      let state = new ExercisesSettingsState(this.defaultExercises());
      this.exercisesSettingsStore = new ExercisesSettingsStore();
      this.saveExercises(state);
      this.exerciseCount = state.Exercises.length;
    }

    this.exerciseToDeleteSubscription = this.exerciseToDelete$
      .pipe(
        withLatestFrom(this.exercises$),
        map(([deletedExercise, exercises]) => {
          if (exercises && deletedExercise)
            return exercises.filter((item) => item != deletedExercise);
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

    this.nextExercise$ = combineLatest([
      this.exercisesSettingsStore.exercises$,
      this.exerciseIndex$,
    ]).pipe(
      map(([exercisesList, index]) => {
        if (exercisesList) return exercisesList[index];
      })
    );
  }

  ngOnDestroy(): void {
    this.exerciseToAddSubscription.unsubscribe();
    this.exerciseToDeleteSubscription.unsubscribe();
  }

  addExercise(exercise: Exercise): void {
    this.exerciseToAdd$.next(exercise);
    this.exerciseCount = this.exerciseCount + 1;
  }

  cycleNextExercise(): void {
    if (this.exerciseIndex + 1 < this.exerciseCount) this.exerciseIndex++;
    else this.exerciseIndex = 0;
    this.exerciseIndex$.next(this.exerciseIndex);
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
    this.exerciseCount = this.exerciseCount - 1;
  }

  saveExercises(exercisesSettingsState: ExercisesSettingsState) {
    this.exercisesSettingsStore.setState(exercisesSettingsState);
    localStorage.setItem(
      exercisesKey,
      JSON.stringify(exercisesSettingsState.toJSON())
    );
  }
}
