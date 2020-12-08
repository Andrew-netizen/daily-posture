import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, fromEvent, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

declare let window: Window;

@Injectable({
  providedIn: 'root',
})
export class SynthesisService implements OnDestroy {
  private message = new BehaviorSubject('');
  private messageAcknowleged = new BehaviorSubject<boolean | null>(null);
  private messageSpoken = new BehaviorSubject<boolean>(false);
  private speakingInstructed = new BehaviorSubject<boolean>(false);

  public message$ = this.message.asObservable().pipe(
    tap((val) => {
      this.utterance.text = val;
    })
  );

  public messageAcknowleged$ = this.messageAcknowleged.asObservable();
  public messageSpoken$ = this.messageSpoken.asObservable();
  public speakingInstructed$ = this.speakingInstructed.asObservable();

  synth = window.speechSynthesis;
  utterance = new SpeechSynthesisUtterance();

  messageSpokenSubscription: Subscription;
  messageSubscription: Subscription;
  speakingInstructedSubscription: Subscription;

  constructor() {
    this.utterance.voice = this.synth.getVoices()[0];
    this.messageSubscription = this.message$.subscribe();

    this.speakingInstructedSubscription = combineLatest([
      this.speakingInstructed$,
      this.messageSpoken$,
      this.messageAcknowleged$,
    ]).subscribe(([speakingInstructed, messageSpoken, messageAcknowleged]) => {
      if (
        (speakingInstructed || messageSpoken) &&
        messageAcknowleged === false
      ) {
        this.synth.speak(this.utterance);
      }
    });

    this.messageSpokenSubscription = fromEvent(this.utterance, 'end').subscribe(
      (value) => {
        this.messageSpoken.next(true);
      }
    );
  }

  ngOnDestroy(): void {
    this.messageSubscription.unsubscribe();
    this.speakingInstructedSubscription.unsubscribe();
  }

  acknowledgeMessage(): void {
    this.messageAcknowleged.next(true);
  }

  speak() {
    this.messageAcknowleged.next(false);
    this.speakingInstructed.next(true);
  }

  updateMessage(messageText: string) {
    this.message.next(messageText);
  }
}
