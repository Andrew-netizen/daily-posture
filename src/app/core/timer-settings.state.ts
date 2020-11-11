import { TotalTime, TotalTimeJSON } from './totaltime.model';

export interface TimerSettingsStateJSON {
  SpokenReminder: boolean;
  TotalTime: TotalTimeJSON
}

export class TimerSettingsState {

  public TotalTime: TotalTime;
  public SpokenReminder: boolean = false;

  constructor(totalTime: TotalTime, spokenReminder: boolean)
  {
    this.TotalTime = totalTime;
    this.SpokenReminder = spokenReminder;
  }

  toJSON(): TimerSettingsStateJSON {
    // copy all fields from `this` to an empty object and return in
    return Object.assign({}, this, {
      // convert fields that need converting
      SpokenReminder: this.SpokenReminder,
      TotalTime: this.TotalTime.toJSON()
    });
  }

  static fromJSON(json: TimerSettingsStateJSON|string): TimerSettingsState {
    if (typeof json === 'string') {
      // if it's a string, parse it first
      return JSON.parse(json, TimerSettingsState.reviver);
    } else {
      // create an instance of the User class
      let user = Object.create(TimerSettingsState.prototype);
      // copy all the fields from the json object
      return Object.assign(user, json, {
        // convert fields that need converting
        SpokenReminder: json.SpokenReminder,
        TotalTime: TotalTime.fromJSON(json.TotalTime)
      });
    }
  }

  static reviver(key: string, value: any): any {
    return key === "" ? TimerSettingsState.fromJSON(value) : value;
  }

}
