export interface TotalTimeJSON {
  hours: number;
  minutes: number;
  seconds: number;
}

export class TotalTime  {

  private _seconds: number = 0;
  private _minutes: number = 0;
  private _hours: number = 0;
  private _totalSeconds: number = 0;

  constructor(hours: number = 0, minutes: number = 0, seconds: number = 0)
  {
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
    this._totalSeconds = this.calculateSeconds(this);
  }

  get seconds(): number {
    return this._seconds;
  }

  set seconds(value: number) {
    if ((value <= 0) || (value >= 60))
      this._seconds = 0;
    else
      this._seconds = value;
    this._totalSeconds = this.calculateSeconds(this);
  }

  get minutes(): number {
    return this._minutes;
  }

  set minutes(value: number) {
    if ((value <= 0) || (value >= 60))
      this._minutes = 0;
    else
      this._minutes = value;
    this._totalSeconds = this.calculateSeconds(this);
  }

  get hours(): number {
    return this._hours;
  }
  set hours(value: number) {
    if (value <= 0)
      this._hours = 0;
    else
      this._hours = value;
    this._totalSeconds = this.calculateSeconds(this);
  }

  get totalSeconds(): number {
    return this._totalSeconds;
  }

  private calculateSeconds(value: TotalTime) {
    let totalTime = value.seconds
    totalTime += value.minutes * 60;
    totalTime += (value.hours * 60) * 60;
    return totalTime;
  }

  toJSON(): TotalTimeJSON {
    return Object.assign({}, this, {
        hours: this.hours,
        minutes: this.minutes,
        seconds: this.seconds,
    });
  }

  static fromJSON(json: TotalTimeJSON|string): TotalTime {
    if (typeof json === 'string') {
      // if it's a string, parse it first
      return JSON.parse(json, TotalTime.reviver);
    } else {
      // create an instance of the TotalTime class
      let totalTime = Object.create(TotalTime.prototype);
      // copy all the fields from the json object
      return Object.assign(totalTime, json, {
        hours: json.hours,
        minutes: json.minutes,
        seconds: json.seconds
      });
    }
  }

   // reviver can be passed as the second parameter to JSON.parse
  // to automatically call TotalTime.fromJSON on the resulting value.
  static reviver(key: string, value: any): any {
    return key === "" ? TotalTime.fromJSON(value) : value;
  }
}
