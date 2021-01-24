import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { BehaviorSubject } from 'rxjs';
import { Exercise } from '../core/exercise.model';
import { CountdownService } from '../services/countdown.service';
import { ExerciseService } from '../services/exercise.service';

import { TimerComponent } from './timer.component';

describe('TimerComponent', () => {
  let component: TimerComponent;
  let fixture: ComponentFixture<TimerComponent>;
  let mockCountdownService;
  let mockExerciseService;
  let mockTimeRemaining$ = new BehaviorSubject('00:29:28');
  let mockNextExercise$ = new BehaviorSubject({title:'Grab', description:'Grab your backside'});
  let allButtons;

  beforeEach(async () => {
    mockCountdownService = jasmine.createSpyObj([
      'begin',
      'pause',
      'resetTimer',
    ]);
    mockCountdownService.timeRemaining$ = mockTimeRemaining$;

    mockExerciseService = jasmine.createSpyObj(['cycleNextExercise']);
    mockExerciseService.nextExercise$ = mockNextExercise$;

    await TestBed.configureTestingModule({
      declarations: [TimerComponent],
      providers: [
        { provide: CountdownService, useValue: mockCountdownService },
        { provide: ExerciseService, useValue: mockExerciseService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    allButtons = fixture.debugElement.queryAll(By.css('button'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should play when the play button is clicked', () => {
    const playButton = findButtonById(allButtons, 'playButtonId');
    expect(playButton).toBeTruthy();
    playButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(mockCountdownService.begin).toHaveBeenCalled();
  });

  it('should pause when the pause button is clicked', () => {
    const pauseButton = findButtonById(allButtons, 'pauseButtonId');
    expect(pauseButton).toBeTruthy();
    pauseButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(mockCountdownService.pause).toHaveBeenCalled();
  });

  it('should skip next exercise when skip button is clicked', () => {
    const skipExerciseButton = findButtonById(allButtons, 'skipButtonId');
    expect(skipExerciseButton).toBeTruthy();
    skipExerciseButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(mockExerciseService.cycleNextExercise).toHaveBeenCalled();
  });
});

function findButtonById(buttons: DebugElement[], id: string) {
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].nativeElement.id === id) return buttons[i];
  }
  return null;
}
