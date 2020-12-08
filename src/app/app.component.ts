import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExercisesModalComponent } from './exercises/components/exercise-modal/exercise-modal.component';
import { CountdownService } from './services/countdown.service';
import { ExerciseService } from './services/exercise.service';
import { SynthesisService } from './services/synthesis.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'daily-posture';

  constructor(
    private modalService: NgbModal,
    private exerciseService: ExerciseService,
    private countdownService: CountdownService,
    private synthesisService: SynthesisService
  ) {
    this.countdownService.appComponent = this;
  }

  async openExerciseModalDialog(
    nextExerciseTitle: string,
    nextExerciseDescription: string
  ): Promise<void> {
    const modalRef = await this.modalService.open(ExercisesModalComponent);
    modalRef.componentInstance.nextExerciseTitle = nextExerciseTitle;
    modalRef.componentInstance.nextExerciseDescription = nextExerciseDescription;
    modalRef.result.then((result) => {
      if (result == 'Done') {
        this.synthesisService.acknowledgeMessage();
        this.exerciseService.cycleNextExercise();
      }
    });
  }
}
