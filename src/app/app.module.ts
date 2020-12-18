import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { TimerComponent } from './timer/timer.component';
import { SettingsComponent } from './settings/settings.component';
import { RouterModule } from '@angular/router';
import { ExercisesShellComponent } from './exercises/containers/exercises-shell/exercises-shell.component';
import { ExercisesListComponent } from './exercises/components/exercises-list/exercises-list.component';
import { ExercisesRowComponent } from './exercises/components/exercises-row/exercises-row.component';
import { ExercisesModalComponent } from './exercises/components/exercise-modal/exercise-modal.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddExerciseModalComponent } from './exercises/components/add-exercise-modal/add-exercise-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    TimerComponent,
    SettingsComponent,
    ExercisesShellComponent,
    ExercisesListComponent,
    ExercisesRowComponent,
    ExercisesModalComponent,
    AddExerciseModalComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
    { path: '', component: TimerComponent, pathMatch: 'full' },
    { path: 'exercises', component: ExercisesShellComponent },
    { path: 'settings', component: SettingsComponent },
], { relativeLinkResolution: 'legacy' }),
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
