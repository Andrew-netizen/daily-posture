import { Exercise } from './exercise.model';

export interface ExercisesSettingsStateJSON {
  Exercises: Exercise[];
}

export class ExercisesSettingsState {
  public Exercises: Exercise[];

  constructor(exercises: Exercise[]) {
    this.Exercises = exercises;
  }

  toJSON(): ExercisesSettingsStateJSON {
    return Object.assign({}, this, {
      Exercises: this.Exercises,
    });
  }

  static fromJSON(
    json: ExercisesSettingsStateJSON | string
  ): ExercisesSettingsState {
    if (typeof json === 'string') {
      // if it's a string, parse it first
      return JSON.parse(json, ExercisesSettingsState.reviver);
    } else {
      // create an instance of the User class
      let user = Object.create(ExercisesSettingsState.prototype);
      // copy all the fields from the json object
      return Object.assign(user, json, {
        // convert fields that need converting
        Exercises: json.Exercises,
      });
    }
  }

  static reviver(key: string, value: any): any {
    return key === '' ? ExercisesSettingsState.fromJSON(value) : value;
  }
}
