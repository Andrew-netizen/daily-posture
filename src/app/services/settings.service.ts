import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TimerSettingsState } from '../core/timer-settings.state';
import { TimerSettingsStore } from '../core/timer-settings.store';
import {TotalTime} from '../core/totaltime.model';

const settingsKey: string = 'DAILY_POSTURE_TIMER_SETTINGS';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private timerSettingsStore: TimerSettingsStore;

  constructor() {

    var stateSetFromLocalStorage: boolean = false;

    const localStorageSettingsText = localStorage.getItem(settingsKey);
    if (localStorageSettingsText)
    {
      let localStorageSettingsState = TimerSettingsState.fromJSON(localStorageSettingsText);
      if (localStorageSettingsState instanceof TimerSettingsState)
      {
        this.timerSettingsStore = new TimerSettingsStore();
        this.timerSettingsStore.setState(localStorageSettingsState);
        stateSetFromLocalStorage = true;
      }
    }

    if (!stateSetFromLocalStorage)
    {
      let state = new TimerSettingsState(new TotalTime(0,30,0), false);
      this.timerSettingsStore = new TimerSettingsStore();
      this.timerSettingsStore.setState(state);
    }

  }

  saveSettings(timerSettingsState: TimerSettingsState) {
    this.timerSettingsStore.setState(timerSettingsState);
    localStorage.setItem(settingsKey, JSON.stringify(timerSettingsState.toJSON()));
  }

  get timerSettingsState$(): Observable<TimerSettingsState> {
    return this.timerSettingsStore.state$;
  }
}
