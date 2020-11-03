import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

declare let window: Window;

@Injectable({
  providedIn: 'root',
})
export class SynthesisService {
  private message = new BehaviorSubject('');
  public message$ = this.message.asObservable().pipe(
    tap((val) => {
      this.utterance.text = val;
    })
  );
  synth = window.speechSynthesis;
  utterance = new SpeechSynthesisUtterance();

  constructor() {
    this.utterance.voice = this.synth.getVoices()[0];
    this.message$.subscribe();
  }

  speak() {
    this.synth.speak(this.utterance);
  }

  updateMessage(messageText: string) {
    this.message.next(messageText);
  }
}
