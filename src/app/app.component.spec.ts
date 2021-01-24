import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {

  @Component({
    selector: 'app-nav-menu',
    template: '<div></div>',
  })
  class FakeNavMenuComponent {

    public navbarCollapsed: boolean = true;

  }
  beforeEach(async() =>  await TestBed.configureTestingModule({
      imports: [RouterTestingModule ],
      declarations: [AppComponent, FakeNavMenuComponent],
    }).compileComponents()
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'daily-posture'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('daily-posture');
  });
})
