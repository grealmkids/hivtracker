import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakecallComponent } from './makecall.component';

describe('MakecallComponent', () => {
  let component: MakecallComponent;
  let fixture: ComponentFixture<MakecallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MakecallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MakecallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
