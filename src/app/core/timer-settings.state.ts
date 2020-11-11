import { TotalTime } from './totaltime.model';
import {Serializable, Serialize, SerializeProperty} from 'ts-serializer';

@Serialize({})
export class TimerSettingsState extends Serializable{

  @SerializeProperty({})
  public TotalTime: TotalTime;

  @SerializeProperty({})
  public SpokenReminder: boolean = false;

  constructor(totalTime: TotalTime, spokenReminder: boolean)
  {
    super();
    this.TotalTime = totalTime;
    this.SpokenReminder = spokenReminder;
  }
}
