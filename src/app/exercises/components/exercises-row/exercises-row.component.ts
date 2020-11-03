import { Component, Input} from '@angular/core';
import { Exercise } from '../../../core/exercise.model';

@Component({
  selector: 'app-exercises-row',
  templateUrl: './exercises-row.component.html',
  styleUrls: ['./exercises-row.component.scss']
})
export class ExercisesRowComponent {
  @Input() exercise: Exercise;



}
