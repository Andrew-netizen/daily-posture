import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ExerciseService } from 'src/app/services/exercise.service';
import { Exercise } from '../../../core/exercise.model';

@Component({
  selector: 'app-exercises-shell',
  templateUrl: './exercises-shell.component.html',
  styleUrls: ['./exercises-shell.component.scss']
})
export class ExercisesShellComponent implements OnInit {

  exercises$: Observable<Exercise[]>;
  constructor(private exerciseService: ExerciseService) {

    this.exercises$ = exerciseService.exercises$;
  }

  ngOnInit(): void {
  }

}
