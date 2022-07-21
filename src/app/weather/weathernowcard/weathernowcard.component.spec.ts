import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeathernowcardComponent } from './weathernowcard.component';

describe('WeathernowcardComponent', () => {
  let component: WeathernowcardComponent;
  let fixture: ComponentFixture<WeathernowcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeathernowcardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeathernowcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
