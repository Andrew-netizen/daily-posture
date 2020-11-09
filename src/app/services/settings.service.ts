import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TimerSettingsState } from '../core/timer-settings.state';
import { TimerSettingsStore } from '../core/timer-settings.store';
import {TotalTime} from '../core/totaltime.model';

@Injectable({
  providedIn: 'root',
})


export class SettingsService {
  private timerSettingsStore: TimerSettingsStore;

  constructor() {
    let state = new TimerSettingsState(new TotalTime(0,30,0), false);
    this.timerSettingsStore = new TimerSettingsStore();
    this.timerSettingsStore.setState(state);

  }

  saveSettings(timerSettingsState: TimerSettingsState) {
    this.timerSettingsStore.setState(timerSettingsState);
  }

  get timerSettingsState$(): Observable<TimerSettingsState> {
    return this.timerSettingsStore.state$;
  }
}
