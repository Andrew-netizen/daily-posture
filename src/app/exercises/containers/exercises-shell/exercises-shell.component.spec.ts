import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExercisesShellComponent } from './exercises-shell.component';

describe('ExercisesShellComponent', () => {
  let component: ExercisesShellComponent;
  let fixture: ComponentFixture<ExercisesShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExercisesShellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExercisesShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
