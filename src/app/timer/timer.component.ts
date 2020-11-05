import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CountdownComponent, CountdownEvent } from 'ngx-countdown';
import { Observable, Subscription } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { CountdownService } from '../services/countdown.service';
import { ExerciseService } from '../services/exercise.service';
import { SynthesisService } from '../services/synthesis.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit, OnDestroy {
  @ViewChild('modalContent') modalContent: ElementRef;
  nextExerciseTitle$: Observable<string>;
  nextExerciseDescription$: Observable<string>;
  timeRemaining$: Observable<string>;
  timerCompletedSubscription: Subscription;

  constructor(private exerciseService: ExerciseService, private modalService: NgbModal,
    private synthesisService: SynthesisService, private countdownService: CountdownService) {
    this.nextExerciseTitle$ = exerciseService.nextExerciseTitle$;
    this.nextExerciseDescription$ = exerciseService.nextExerciseDescription$;
    this.timeRemaining$ = countdownService.timeRemaining$;
    this.timerCompletedSubscription = countdownService.timerCompleted$.subscribe(result => {
      if (result)
      {
        this.nextExerciseDescription$.pipe(first()).subscribe(result => {
          this.synthesisService.updateMessage(result);
          this.synthesisService.speak();
        });

        this.openConfirmModal(this.modalContent);
      }
    });
  }
  ngOnDestroy(): void {
    this.timerCompletedSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.countdownService.setTimeLeft(1800);
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

  handleEvent(event: CountdownEvent) {
    if (event.action == "done")
    {
      this.nextExerciseDescription$.pipe(first()).subscribe(result => {
        this.synthesisService.updateMessage(result);
        this.synthesisService.speak();
      });

      this.openConfirmModal(this.modalContent);
    }
  }

  openConfirmModal(content): void {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      if (result == "Done")
        this.exerciseService.cycleNextExercise();
    });
  }

}
