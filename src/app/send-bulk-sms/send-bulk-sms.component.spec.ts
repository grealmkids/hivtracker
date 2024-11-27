import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendBulkSmsComponent } from './send-bulk-sms.component';

describe('SendBulkSmsComponent', () => {
  let component: SendBulkSmsComponent;
  let fixture: ComponentFixture<SendBulkSmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendBulkSmsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendBulkSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
