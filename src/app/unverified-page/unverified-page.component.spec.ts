import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnverifiedPageComponent } from './unverified-page.component';

describe('UnverifiedPageComponent', () => {
  let component: UnverifiedPageComponent;
  let fixture: ComponentFixture<UnverifiedPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnverifiedPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnverifiedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
