import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CountdownComponent } from 'ngx-countdown';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit {
  @ViewChild('cd', { static: false }) private countdown: CountdownComponent;

  constructor() {}

  ngOnInit(): void {}

  startTimer(): void {
    this.countdown.begin();
  }

  pauseTimer(): void {
    this.countdown.pause();
  }

  resetTimer(): void {
    this.countdown.restart();
  }
}
