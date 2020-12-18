import { Component, OnInit } from '@angular/core';
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

  addExerciseForm: FormGroup;
  exerciseToAdd: Exercise | null;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private exerciseService: ExerciseService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.exerciseToAdd = new Exercise('','');
  }

  private createForm(): void {
    this.addExerciseForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  createExercise(formGroup: FormGroup): void {
    if (formGroup.valid) {
       const exercise = { ... this.exerciseToAdd, ... formGroup.value};
       this.exerciseService.addExercise(exercise);
       this.activeModal.close();
    }
  }
}
