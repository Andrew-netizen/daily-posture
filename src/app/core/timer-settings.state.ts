import { TotalTime } from './totaltime.model';

export class TimerSettingsState {
  public TotalTime: TotalTime;
  public SpokenReminder: boolean = false;

  constructor(totalTime: TotalTime, spokenReminder: boolean)
  {
    this.TotalTime = totalTime;
    this.SpokenReminder = spokenReminder;
  }
}
