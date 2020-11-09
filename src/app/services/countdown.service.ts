import { formatNumber } from '@angular/common';
import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  Subject,
  Subscription,
  timer,
} from 'rxjs';
import { filter, first, map, switchMap, skip, takeWhile } from 'rxjs/operators';
import { AppComponent } from '../app.component';
import { ExerciseService } from './exercise.service';
import { SettingsService } from './settings.service';
import { SynthesisService } from './synthesis.service';

@Injectable({
  providedIn: 'root',
})
export class CountdownService implements OnDestroy {
  public timeRemaining$ = new BehaviorSubject<string>('');
  private timerCompleted$ = new Subject<boolean>();

  private timerRunning$ = new BehaviorSubject<boolean>(false);

  // An observable containing the number of seconds that are remaining.
  private secondsRemaining$: Observable<number>;

  // The initial value that the timer starts counting down from.
  private countdownTotalSeconds: number;
  // The last published value of the number of seconds remaining.
  private lastSecondsRemaining: number;

  // Get the timer total seconds from the user settings.
  private totalSecondsSetting: number;

  private secondsRemainingSubscription: Subscription;
  private timerCompletedSubscription: Subscription;
  private settingsStateSubscription: Subscription;

  // Need a reference to the app Component
  private mAppComponent: AppComponent;
  set appComponent(app: AppComponent) {
    this.mAppComponent = app;
  }

  toRemainingSeconds = (t: number) => this.countdownTotalSeconds - t;

  constructor(
    private exerciseService: ExerciseService,
    private synthesisService: SynthesisService,
    private settingsService: SettingsService
  ) {
    this.defineSubscriptions();
    this.setTimeLeft(this.totalSecondsSetting);
  }

  ngOnDestroy(): void {
    this.performUnsubscriptions();
  }

  formatTime(t: number) {
    var hours, minutes, seconds;
    hours = Math.floor(t / 3600) % 24;
    t -= hours * 3600;
    minutes = Math.floor(t / 60) % 60;
    t -= minutes * 60;
    seconds = t % 60;

    return [
      formatNumber(hours, 'en', '2.0'),
      formatNumber(minutes, 'en', '2.0'),
      formatNumber(seconds, 'en', '2.0'),
    ].join(':');
  }

  begin(): void {
    this.timerRunning$.next(true);
  }

  pause(): void {
    // Set the countdown Total Seconds to be the current seconds remaining, so that
    // it resumes counting from that value when the user restarts the timer.

    this.timerRunning$.next(false);
    this.countdownTotalSeconds = this.lastSecondsRemaining;
  }

  setTimeLeft(seconds: number): void {
    this.countdownTotalSeconds = seconds;
    this.lastSecondsRemaining = seconds;
    this.timerRunning$.next(false);
    this.timeRemaining$.next(this.formatTime(seconds));
  }

  resetTimer(seconds: number): void {
    // The unsubscribe/subscribe functionality is necessary because once the
    // secondsRemaining$ observable completes, it will not publish again.
    // This means it must be recreated.
    this.performUnsubscriptions();
    this.defineSubscriptions();
    this.setTimeLeft(seconds);
  }

  defineSubscriptions(): void {
    this.settingsStateSubscription = this.settingsService.timerSettingsState$.subscribe(
      (timerSettingsState) => {
        this.totalSecondsSetting = timerSettingsState.TotalTime.totalSeconds;
        this.setTimeLeft(this.totalSecondsSetting);
      }
    );

    this.secondsRemaining$ = this.timerRunning$.pipe(
      switchMap((running: boolean) => {
        return running ? timer(0, 1000) : EMPTY;
      }),
      map(this.toRemainingSeconds),
      takeWhile((t) => t >= 0)
    );

    this.secondsRemainingSubscription = this.secondsRemaining$.subscribe({
      next: (value) => {
        // Store the last seconds remaining in case it is needed when the user pauses.
        this.lastSecondsRemaining = value;
        this.timeRemaining$.next(this.formatTime(value));
      },
      complete: () => {
        this.timerCompleted$.next(true);
      },
    });

    this.timerCompletedSubscription = this.timerCompleted$.subscribe(
      async (result) => {
        if (result) {
          const nextExercise = await this.getValue(this.exerciseService.nextExercise$);

          this.mAppComponent.openExerciseModalDialog(
            nextExercise.title,
            nextExercise.description
          );

          this.synthesisService.updateMessage(nextExercise.description);
          this.synthesisService.speak();
        }
      }
    );
  }

  performUnsubscriptions(): void {
    if (this.hasValue(this.timerCompletedSubscription))
      this.timerCompletedSubscription.unsubscribe();

    if (this.hasValue(this.secondsRemainingSubscription))
      this.secondsRemainingSubscription.unsubscribe();

    if (this.hasValue(this.settingsStateSubscription))
      this.settingsStateSubscription.unsubscribe();
  }

  hasValue(value: any): boolean {
    return value !== null && value !== undefined;
  }

  getValue<T>(observable: Observable<T>): Promise<T> {
    return observable.pipe(filter(this.hasValue), first()).toPromise();
  }
}
