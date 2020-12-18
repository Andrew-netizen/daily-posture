import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Store } from "rxjs-observable-store";
import { map } from "rxjs/operators";
import { Exercise } from "./exercise.model";
import { ExercisesSettingsState } from "./exercises-settings.state";

@Injectable()
export class ExercisesSettingsStore extends Store<ExercisesSettingsState> {

  constructor() {
    super(new ExercisesSettingsState([]));
  }

  get exercises$(): Observable<Exercise[]> {
    return this.state$.pipe(map((value) => value.Exercises));
  }
}
