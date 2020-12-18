import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { ExerciseService } from 'src/app/services/exercise.service';
import { Exercise } from '../../../core/exercise.model';
import { AddExerciseModalComponent } from '../../components/add-exercise-modal/add-exercise-modal.component';

@Component({
  selector: 'app-exercises-shell',
  templateUrl: './exercises-shell.component.html',
  styleUrls: ['./exercises-shell.component.scss'],
})
export class ExercisesShellComponent implements OnInit {
  exercises$: Observable<Exercise[]>;
  constructor(
    private exerciseService: ExerciseService,
    private modalService: NgbModal
  ) {
    this.exercises$ = exerciseService.exercises$;
  }

  ngOnInit(): void {}

  onAddExerciseClicked(): void {
    this.modalService.open(AddExerciseModalComponent);
  }

  onExerciseDeleted(exercise: Exercise): void {
    this.exerciseService.deleteExercise(exercise);
  }
}
