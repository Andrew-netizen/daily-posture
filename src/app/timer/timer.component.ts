import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  Injector,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { CountdownService } from '../services/countdown.service';
import { ExerciseService } from '../services/exercise.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit {
  timeRemaining$: BehaviorSubject<string>;

  nextExerciseTitle$: Observable<string>;

  constructor(
    private exerciseService: ExerciseService,
    private countdownService: CountdownService
  ) {}

  ngOnInit(): void {
    this.timeRemaining$ = this.countdownService.timeRemaining$;
    this.nextExerciseTitle$ = this.exerciseService.nextExerciseTitle$;
  }

  startTimer(): void {
    this.countdownService.begin();
  }

  pauseTimer(): void {
    this.countdownService.pause();
  }

  resetTimer(): void {
    this.countdownService.resetTimer(1800);
  }
}
