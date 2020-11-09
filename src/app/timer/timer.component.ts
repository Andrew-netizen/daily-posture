import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { Exercise } from '../core/exercise.model';
import { TimerSettingsState } from '../core/timer-settings.state';
import { CountdownService } from '../services/countdown.service';
import { ExerciseService } from '../services/exercise.service';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit, OnDestroy {
  timeRemaining$: BehaviorSubject<string>;

  nextExercise$: Observable<Exercise>;
  private settingsState: TimerSettingsState;
  private componentActive: boolean = true;
  private stateSubscription: Subscription;

  constructor(
    private exerciseService: ExerciseService,
    private countdownService: CountdownService,
    private settingsService: SettingsService
  ) {}


  ngOnInit(): void {
    this.timeRemaining$ = this.countdownService.timeRemaining$;
    this.nextExercise$ = this.exerciseService.nextExercise$;
    this.stateSubscription = this.settingsService.timerSettingsState$
    .pipe(takeWhile(() => this.componentActive))
    .subscribe((timerSettingsState) => {
      this.settingsState = timerSettingsState;
    });
  }

  ngOnDestroy(): void {
    this.componentActive = false;
    this.stateSubscription.unsubscribe();
  }

  startTimer(): void {
    this.countdownService.begin();
  }

  pauseTimer(): void {
    this.countdownService.pause();
  }

  resetTimer(): void {
    this.countdownService.resetTimer(this.settingsState.TotalTime.totalSeconds);
  }
}
