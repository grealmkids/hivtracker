import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupabaseService } from '../superbase.service';
import { CommonModule } from '@angular/common';
import { NewPatientComponent } from "../new-patient/new-patient.component";

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NewPatientComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  patients: any[] = [];
  selectedPatient: any = null;
  dynamicData: any[] = [];
  showPatients = true;  // Ensures that patient list is shown by default
  newPatient = false;
  editPatientForm: FormGroup;
  editPatientFormVisible = false;
  showDynamicData: boolean = false;

  constructor(
    private supabaseService: SupabaseService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    // Load patients initially
    this.loadPatients();

    // Initialize edit form
    this.editPatientForm = this.fb.group({
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

  ngOnInit() {
    // Check for query params and reload patients if reload=true
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['reload'] === 'true') {
        this.loadPatients(); // Reload patients if query param is set
      }
    });
  }

  // Fetch all static patients data
  async loadPatients() {
    const { data, error } = await this.supabaseService.getStaticPatients();
    if (error) {
      console.error('Error fetching patients:', error);
    } else {
      this.patients = data || [];
    }
  }

  // Load the selected patient data into the edit form
  loadPatientForEdit(patient: any) {
    this.showPatients = false;
    this.newPatient = false;  // Show new patient form
    this.selectedPatient = patient;
    this.showDynamicData = false;
    this.editPatientForm.patchValue({
      name: patient.name,
      dob: patient.dob,
      clinic: patient.clinic,
      village: patient.village,
      district: patient.district,
      mobile: patient.mobile,
      whatsapp_no: patient.whatsapp_no,
      nok: patient.nok,
      nok_contact: patient.nok_contact,
      favourite_social_media: patient.favourite_social_media,
      favourite_radio: patient.favourite_radio,
      favourite_tv: patient.favourite_tv,
    });

    // Set the form to be visible
    this.editPatientFormVisible = true;
  }

  // Handle form submission for saving changes
  async onSubmitEdit() {
    if (this.editPatientForm.valid) {
      const updatedData = this.editPatientForm.value;
      const { error } = await this.supabaseService.updateStaticPatient(this.selectedPatient.id, updatedData);
      if (error) {
        console.error('Error updating patient:', error);
      } else {
        this.editPatientFormVisible = false;
        this.loadPatients();  // Reload the patient list after update
      }
    }
  }

  // Fetch dynamic data for a selected patient
  async loadDynamicData(patientId: string) {
    this.selectedPatient = this.patients.find((p) => p.id === patientId);
    this.showPatients = false;
    const { data, error } = await this.supabaseService.getDynamicData(patientId);
    if (error) {
      console.error('Error fetching dynamic data:', error);
    } else {
      this.dynamicData = data || [];
    }
  }

  // Function to reset the view to show patients list only
  showAllPatients() {
    this.editPatientFormVisible = false;
    this.showPatients = true; // Show the patient list
    this.selectedPatient = null; // Reset selected patient
    this.dynamicData = []; // Clear dynamic data
  }

  // Function to navigate to the new patient form
  navigateToAddPatient() {
    this.showDynamicData = false;
    this.showPatients = false;  // Hide patient list
    this.newPatient = true;  // Show new patient form
  }

  // Logout function
  async logout() {
    await this.supabaseService.logout();
    this.router.navigate(['/login']);
  }
}
