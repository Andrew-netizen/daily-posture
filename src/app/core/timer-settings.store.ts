import { Injectable } from "@angular/core";

import {TimerSettingsState} from './timer-settings.state'
import {Store} from 'rxjs-observable-store';
import { TotalTime } from './totaltime.model';

@Injectable()
export class TimerSettingsStore extends Store<TimerSettingsState> {

  constructor() {
    super(new TimerSettingsState(new TotalTime(0,30,0), false));
  }
}
