import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { TimerComponent } from './timer/timer.component';
import { SettingsComponent } from './settings/settings.component';
import { ExercisesComponent } from './exercises/exercises.component';
import { RouterModule } from '@angular/router';
import { CountdownModule } from 'ngx-countdown';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    TimerComponent,
    SettingsComponent,
    ExercisesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CountdownModule,
    RouterModule.forRoot([
      { path: '', component: TimerComponent, pathMatch: 'full' },
      { path: 'exercises', component: ExercisesComponent },
      { path: 'settings', component: SettingsComponent }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
