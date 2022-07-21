import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeathermodalComponent } from './weathermodal.component';

describe('WeathermodalComponent', () => {
  let component: WeathermodalComponent;
  let fixture: ComponentFixture<WeathermodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeathermodalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeathermodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
