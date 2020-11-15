import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Exercise } from '../core/exercise.model';

const exercisesKey: string = 'DAILY_POSTURE_EXERCISE_LIST';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  localStorage: Storage;
  private mExercises$ = new BehaviorSubject<Exercise[]>([]);
  private exerciseIndex: number = 0;
  private exerciseIndex$ = new BehaviorSubject<number>(0);
  private exerciseCount: number;

  get exercises$(): Observable<Exercise[]> {
    return this.mExercises$;
  }

  public nextExercise$ = combineLatest([
    this.mExercises$,
    this.exerciseIndex$,
  ]).pipe(
    map(([exercisesList, index]) => {
      return exercisesList[index];
    })
  );

  cycleNextExercise(): void {
    if (this.exerciseIndex + 1 < this.exerciseCount) this.exerciseIndex++;
    else this.exerciseIndex = 0;
    this.exerciseIndex$.next(this.exerciseIndex);
  }

  constructor() {
    this.localStorage = window.localStorage;
    this.mExercises$.next(this.defaultExercises());
    this.exerciseCount = this.defaultExercises().length;
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
}
