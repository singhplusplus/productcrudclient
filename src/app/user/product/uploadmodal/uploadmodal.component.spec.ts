import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadmodalComponent } from './uploadmodal.component';

describe('UploadmodalComponent', () => {
  let component: UploadmodalComponent;
  let fixture: ComponentFixture<UploadmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadmodalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
