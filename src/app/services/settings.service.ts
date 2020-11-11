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

    var stateSetFromStorage: boolean = false;

    const savedSettingsText = localStorage.getItem(settingsKey);
    if (savedSettingsText)
    {
      var settingsObject = new TimerSettingsState(null,false);
      settingsObject.deserialize(JSON.parse(savedSettingsText));
      if (settingsObject instanceof TimerSettingsState)
      {
        console.log("settingsobbject totaltime seconds ", settingsObject.TotalTime._seconds);
        var savedTotalTime = new TotalTime (settingsObject.TotalTime._hours, settingsObject.TotalTime._minutes, settingsObject.TotalTime._seconds);
        var savedSettings = new TimerSettingsState(savedTotalTime, false);
        this.timerSettingsStore = new TimerSettingsStore();
        this.timerSettingsStore.setState(savedSettings);
        stateSetFromStorage = true;
      }
    }

    if (!stateSetFromStorage)
    {
      let state = new TimerSettingsState(new TotalTime(0,30,0), false);
      this.timerSettingsStore = new TimerSettingsStore();
      this.timerSettingsStore.setState(state);
    }

  }

  saveSettings(timerSettingsState: TimerSettingsState) {
    this.timerSettingsStore.setState(timerSettingsState);

    console.log("saving to local storage:", timerSettingsState.serialize());
    localStorage.setItem(settingsKey, JSON.stringify(timerSettingsState.serialize()));
  }

  get timerSettingsState$(): Observable<TimerSettingsState> {
    return this.timerSettingsStore.state$;
  }
}
