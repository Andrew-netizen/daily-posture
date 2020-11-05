import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-exercise-modal',
  templateUrl: './exercise-modal.component.html'
})
export class ExercisesModalComponent  {
  @Input() nextExerciseTitle: string;
  @Input() nextExerciseDescription: string;

  constructor(public activeModal: NgbActiveModal) {}

}
