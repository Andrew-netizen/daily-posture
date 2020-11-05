import { formatNumber } from '@angular/common';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  NEVER,
  Observable,
  Subscription,
  timer,
} from 'rxjs';
import {
  map,
  switchMap,
  takeWhile,
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CountdownService implements OnDestroy {
  public timeRemaining$ = new BehaviorSubject<string>('');
  public timerCompleted$ = new BehaviorSubject<boolean>(false);

  private timerRunning$ = new BehaviorSubject<boolean>(false);

  // An observable containing the number of seconds that are remaining.
  private secondsRemaining$: Observable<number>;

  // The initial value that the timer starts counting down from.
  private countdownTotalSeconds: number;
  // The last published value of the number of seconds remaining.
  private lastSecondsRemaining: number;

  private secondsRemainingSubscription: Subscription;


  toRemainingSeconds = (t: number) => this.countdownTotalSeconds - t;

  constructor() {
    this.defineSubscriptions();
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
    // seondsRemaining$ observable completes, it will not publish again.
    // This means it must be recreated.
    this.performUnsubscriptions();
    this.defineSubscriptions();
    this.setTimeLeft(seconds);
  }

  defineSubscriptions(): void {

    this.secondsRemaining$ = this.timerRunning$.pipe(
      switchMap((running: boolean) => {
        return running ? timer(0, 1000) : NEVER;
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
      complete: () => this.timerCompleted$.next(true),
    });

  }

  performUnsubscriptions(): void {

    if (
      this.secondsRemainingSubscription != null &&
      this.secondsRemainingSubscription != undefined
    )
      this.secondsRemainingSubscription.unsubscribe();
  }
}
