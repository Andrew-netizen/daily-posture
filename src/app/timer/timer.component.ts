import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CountdownComponent, CountdownEvent } from 'ngx-countdown';
import { Observable } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { ExerciseService } from '../services/exercise.service';
import { SynthesisService } from '../services/synthesis.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit {
  @ViewChild('cd', { static: false }) private countdown: CountdownComponent;
  @ViewChild('modalContent') modalContent: ElementRef;
  nextExerciseTitle$: Observable<string>;
  nextExerciseDescription$: Observable<string>;

  constructor(private exerciseService: ExerciseService, private modalService: NgbModal,
    private synthesisService: SynthesisService) {
    this.nextExerciseTitle$ = exerciseService.nextExerciseTitle$;
    this.nextExerciseDescription$ = exerciseService.nextExerciseDescription$;
  }

  ngOnInit(): void {}

  startTimer(): void {
    this.countdown.begin();
  }

  pauseTimer(): void {
    this.countdown.pause();
  }

  resetTimer(): void {
    this.countdown.restart();
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
