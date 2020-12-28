import { Component, Input, Output} from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ExerciseService } from 'src/app/services/exercise.service';
import { Exercise } from '../../../core/exercise.model';

@Component({
  selector: 'app-exercises-row',
  templateUrl: './exercises-row.component.html',
  styleUrls: ['./exercises-row.component.scss']
})
export class ExercisesRowComponent {
  @Input() exercise: Exercise;
  @Input() rowIndex: number;
  @Output() exerciseDeleted = new EventEmitter<Exercise>();
  @Output() exerciseTitleClicked = new EventEmitter<number>();

  onExerciseDeleted(exercise: Exercise): void {
    this.exerciseDeleted.emit(exercise);
  }

  onExerciseTitleClicked(): void {
    this.exerciseTitleClicked.emit(this.rowIndex);
  }
}
