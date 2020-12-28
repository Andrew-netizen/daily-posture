import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { ExerciseService } from 'src/app/services/exercise.service';
import { Exercise } from '../../../core/exercise.model';
import { AddExerciseModalComponent } from '../../components/add-exercise-modal/add-exercise-modal.component';

@Component({
  selector: 'app-exercises-shell',
  templateUrl: './exercises-shell.component.html',
  styleUrls: ['./exercises-shell.component.scss'],
})
export class ExercisesShellComponent implements OnInit, OnDestroy {
  exercises$: Observable<Exercise[]>;
  private focussedExerciseIndex$ = new BehaviorSubject<number>(-1);
  private focussedExercise: Exercise;

  private focussedExerciseIndexSubscription: Subscription;

  constructor(
    private exerciseService: ExerciseService,
    private modalService: NgbModal
  ) {
    this.exercises$ = exerciseService.exercises$;

    this.focussedExerciseIndexSubscription = this.focussedExerciseIndex$
      .pipe(
        withLatestFrom(this.exercises$),
        map(([index, exerciseList]) => {
          if (exerciseList && index >= 0) return exerciseList[index];
        })
      )
      .subscribe((value: Exercise) => (this.focussedExercise = value));
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.focussedExerciseIndexSubscription.unsubscribe();
  }

  onAddExerciseClicked(): void {
    const addModalRef = this.modalService.open(AddExerciseModalComponent);
    addModalRef.componentInstance.rowIndex = -1;
    addModalRef.componentInstance.exerciseToUpdate = new Exercise('', '');
    addModalRef.componentInstance.displayForm();
  }

  onExerciseDeleted(exercise: Exercise): void {
    this.exerciseService.deleteExercise(exercise);
  }

  onExerciseTitleClicked(index: number): void {
    this.focussedExerciseIndex$.next(index);
    const editModalRef = this.modalService.open(AddExerciseModalComponent);
    editModalRef.componentInstance.rowIndex = index;
    editModalRef.componentInstance.exerciseToUpdate = this.focussedExercise;
    editModalRef.componentInstance.displayForm();
  }
}
