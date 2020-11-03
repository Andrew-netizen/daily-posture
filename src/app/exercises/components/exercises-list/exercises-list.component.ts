import { Component, Input } from '@angular/core';
import { Exercise } from '../../../core/exercise.model';

@Component({
  selector: 'app-exercises-list',
  templateUrl: './exercises-list.component.html',
  styleUrls: ['./exercises-list.component.scss']
})
export class ExercisesListComponent  {
  @Input() exercises: Exercise[];


}
