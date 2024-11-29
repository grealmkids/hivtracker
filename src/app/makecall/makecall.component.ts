import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../superbase.service';

@Component({
  selector: 'app-makecall',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './makecall.component.html',
  styleUrls: ['./makecall.component.css'],
})
export class MakeCallComponent {
  makeCallForm: FormGroup;
  showMakeCallForm: boolean = true;

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService
  ) {
    // Retrieve patient_id from SupabaseService's signal
    const patientId = this.supabaseService.selectedPatientId();

    // Initialize the form and set patient_id
    this.makeCallForm = this.fb.group({
      patient_id: [patientId || '', Validators.required],
      reminder_call_number: ['', Validators.required],
      reminder_date: ['', Validators.required],
      adherence_challenges: [''],
      complaint: [''],
      complaint_status: [''],
      baby_pcr_result: [''],
      hiv_serology_18_months: [''],
      exit_status: [''],
    });

    // Debugging patient_id
    console.log('Initialized patient_id:', this.makeCallForm.get('patient_id')?.value);
  }

  async onSubmitDynamic() {
    if (this.makeCallForm.valid) {
      const callData = this.makeCallForm.value;
      console.log('Submitting data:', callData);

      try {
        // Insert data via SupabaseService
        const data = await this.supabaseService.addDynamicData(callData);
        console.log('Data uploaded successfully:', data);

        this.makeCallForm.reset();
        this.showMakeCallForm = false;
        alert('Data uploaded successfully!');
      } catch (error) {
        console.error('Error uploading data:', error);
        alert('Failed to upload data. Please try again.');
      }
    } else {
      console.error('Form is invalid:', this.makeCallForm.value);
      alert('Please fill in all required fields.');
    }
  }

  showAllCalls() {
    window.location.href = '/dashboard'; // Navigate to dashboard
  }
}
