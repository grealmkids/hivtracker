import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLabResultsComponent } from './new-lab-results.component';

describe('NewLabResultsComponent', () => {
  let component: NewLabResultsComponent;
  let fixture: ComponentFixture<NewLabResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewLabResultsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewLabResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
