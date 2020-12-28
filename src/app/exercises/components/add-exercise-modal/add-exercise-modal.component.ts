import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Exercise } from 'src/app/core/exercise.model';
import { ExerciseService } from 'src/app/services/exercise.service';

@Component({
  selector: 'app-add-exercise-modal',
  templateUrl: './add-exercise-modal.component.html',
  styleUrls: ['./add-exercise-modal.component.scss'],
})
export class AddExerciseModalComponent implements OnInit {
  @Input() exerciseToUpdate: Exercise;
  @Input() rowIndex: number;

  pageTitle: string = 'EDIT EXERCISE';
  saveButtonText: string = 'SAVE';
  addExerciseForm: FormGroup;
  public exerciseToAdd: Exercise | null;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private exerciseService: ExerciseService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    // this.exerciseToAdd = new Exercise('','');
  }

  private createForm(): void {
    this.addExerciseForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  createExercise(formGroup: FormGroup): void {
    if (formGroup.valid) {
      const exercise = { ...this.exerciseToUpdate, ...formGroup.value };
      if (this.creatingExercise()) this.exerciseService.addExercise(exercise);
      else this.exerciseService.updateExercise(exercise, this.rowIndex);
      this.activeModal.close();
    }
  }

  displayForm(): void {
    if (this.creatingExercise()) {
      this.pageTitle = 'ADD EXERCISE';
      this.saveButtonText = 'CREATE';
    } else {
      this.pageTitle = 'EDIT EXERCISE';
      this.saveButtonText = 'UPDATE';
    }

    if (this.exerciseToUpdate) {
      this.addExerciseForm.reset();
      this.addExerciseForm.patchValue({
        title: this.exerciseToUpdate.title,
        description: this.exerciseToUpdate.description,
      });
    }
  }

  creatingExercise(): boolean {
    return this.rowIndex < 0;
  }
}
