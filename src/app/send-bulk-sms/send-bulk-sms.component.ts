import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../superbase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-send-bulk-sms',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './send-bulk-sms.component.html',
  styleUrl: './send-bulk-sms.component.css'
})
export class SendBulkSmsComponent {
  sendBulkSmsForm: FormGroup;
  showsendBulkSmsForm: boolean = true;
  districts: string[] = [ // List of districts
    'District A',
    'District B',
    'District C',
    'District D',
  ];

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.sendBulkSmsForm = this.fb.group({
      smsScheduleDate: ['', Validators.required], // SMS Schedule Date field
      smsScheduleTime: ['', Validators.required], // SMS Schedule Time field
      district: ['', Validators.required],        // Select Patients by District
      message: ['', [Validators.required, Validators.minLength(1)]], // Message field
    });
  }

  async onSubmit() {
    if (this.sendBulkSmsForm.valid) {
      const smsData = this.sendBulkSmsForm.value;

      try {
        const { data, error } = await this.supabaseService.addStaticPatient(smsData);

        if (error) {
          console.error('Error sending SMS:', error);
        } else {
          console.log('SMS scheduled successfully:', data);
          this.showsendBulkSmsForm = false;
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  }

  showAllPatients() {
    window.location.href = '/dashboard'; // Hard reload
  }
}
