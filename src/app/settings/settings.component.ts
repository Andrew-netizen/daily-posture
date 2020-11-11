import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { TimerSettingsState } from '../core/timer-settings.state';
import { TotalTime } from '../core/totaltime.model';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  settingsForm: FormGroup;
  public timerSettingsState: TimerSettingsState;
  private componentActive: boolean = true;
  private stateSubscription: Subscription;

  constructor(
    formBuilder: FormBuilder,
    private settingsService: SettingsService
  ) {
    this.settingsForm = formBuilder.group({
      hours: 0,
      minutes: 0,
      seconds: 0,
      spokenReminder: false,
    });
  }

  ngOnInit(): void {
    this.stateSubscription = this.settingsService.timerSettingsState$
      .pipe(takeWhile(() => this.componentActive))
      .subscribe((timerSettingsState) =>
        this.displaySettings(timerSettingsState)
      );
  }

  ngOnDestroy(): void {
    this.componentActive = false;
    this.stateSubscription.unsubscribe();
  }

  saveSettings(existingSettingsState: TimerSettingsState): void {
    if (this.settingsForm.valid) {
      if (this.settingsForm.dirty) {
        let totalTime = new TotalTime(
          this.settingsForm.controls['hours'].value,
          this.settingsForm.controls['minutes'].value,
          this.settingsForm.controls['seconds'].value
        );
        const newState = new TimerSettingsState(totalTime, false);

        this.settingsService.saveSettings(newState);
      }
    }
  }

  displaySettings(timerSettingsState: TimerSettingsState) {
    this.timerSettingsState = timerSettingsState;
    this.settingsForm.patchValue({
      hours: this.timerSettingsState.TotalTime.hours,
      minutes: this.timerSettingsState.TotalTime.minutes,
      seconds: this.timerSettingsState.TotalTime.seconds,
    });
  }
}
