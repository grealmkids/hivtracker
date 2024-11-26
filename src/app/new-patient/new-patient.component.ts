import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupabaseService } from '../superbase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-patient',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-patient.component.html',
  styleUrls: ['./new-patient.component.css'],
})
export class NewPatientComponent {
  newPatientForm: FormGroup;
  showNewPatientForm:boolean=true;

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.newPatientForm = this.fb.group({
      name: ['', Validators.required],
      dob: ['', Validators.required],
      clinic: ['', Validators.required],
      village: ['', Validators.required],
      district: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      whatsapp_no: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      nok: ['', Validators.required],
      nok_contact: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      favourite_social_media: ['', Validators.required],
      favourite_radio: ['', Validators.required],
      favourite_tv: ['', Validators.required],
    });
  }

  async onSubmit() {
    if (this.newPatientForm.valid) {
      const patientData = this.newPatientForm.value;
  
      try {
        const { data, error } = await this.supabaseService.addStaticPatient(patientData);
  
        if (error) {
          console.error('Error adding patient:', error);
        } else {
          console.log('Patient added successfully:', data);
          this.showNewPatientForm=false;

          // After successful addition, navigate back to the dashboard with reload flag
          //this.router.navigate(['/dashboard'], { queryParams: { reload: true } });
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  }
  
  showAllPatients() {
    this.router.navigate(['/dashboard']);
  }

}
