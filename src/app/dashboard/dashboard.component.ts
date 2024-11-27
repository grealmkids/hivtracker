import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupabaseService } from '../superbase.service';
import { CommonModule } from '@angular/common';
import { NewPatientComponent } from "../new-patient/new-patient.component";
import { SendBulkSmsComponent } from "../send-bulk-sms/send-bulk-sms.component";
import { MakecallComponent } from "../makecall/makecall.component";

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NewPatientComponent, SendBulkSmsComponent, MakecallComponent],
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
  editedPatient: boolean = false;
  deletedpatientAlert:boolean=false;
  filteredPatients: any[] = []; // New variable for filtered patients
  bulksms:boolean=false;
  makecall:boolean=false;

  deletedPatientAlert = false;  // Corrected variable name

  searchQuery: string = ''; // Added search query

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
      this.filteredPatients = [...this.patients]; // Initialize filtered patients list
    }
  }

  // Load the selected patient data into the edit form
  loadPatientForEdit(patient: any) {
    this.showPatients = false;
    this.newPatient = false;  // Show new patient form
    this.selectedPatient = patient;
    this.bulksms=false;

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
    this.showDynamicData = false;
    this.bulksms=false;
    this.editPatientFormVisible = true;
  }

  // Handle form submission for saving changes
  async onSubmitEdit() {
    this.showDynamicData = false;
    try {
      const updatedData = this.editPatientForm.value;
      const { error } = await this.supabaseService.updateStaticPatient(this.selectedPatient.id, updatedData);
      if (error) {
        console.error('Error updating patient:', error);
      } else {
        this.editPatientFormVisible = false;
        this.editedPatient = true;  // Reload the patient list after update
      }
    } catch (error) {
      console.log(error);
    }
  }

  reloadPatients() {
    window.location.href = '/dashboard'; // Hard reload  
  }

  // Fetch dynamic data for a selected patient
  async loadDynamicData(patientId: string) {
    this.selectedPatient = this.patients.find((p) => p.id === patientId);
    this.showPatients = false;
    this.bulksms=false;
    this.editPatientFormVisible = false;
    const { data, error } = await this.supabaseService.getDynamicData(patientId);
    if (error) {
      console.error('Error fetching dynamic data:', error);
    } else {
      this.dynamicData = data || [];
    }
  }

  // Function to reset the view to show patients list only
  showAllPatients() {
    this.newPatient = false;
    this.editPatientFormVisible = false;
    this.showPatients = true; // Show the patient list
    this.selectedPatient = null; // Reset selected patient
    this.dynamicData = []; // Clear dynamic data
    this.bulksms=false;
    
  }

  // Function to navigate to the new patient form
  navigateToAddPatient() {
    this.editPatientFormVisible = false;
    this.showDynamicData = false;
    this.showPatients = false;  // Hide patient list
    this.bulksms=false;
    this.newPatient = true;  // Show new patient form
  }

  // Delete patient function
  async onDeletePatient() {
    if (confirm('Are you sure you want to delete this patient?')) {
      const { error } = await this.supabaseService.deletePatient(this.selectedPatient.id);
      if (error) {
        console.error('Error deleting patient:', error);
      } else {
        this.bulksms=false;
        this.deletedpatientAlert=true;
        this.selectedPatient = null;  // Reset selected patient after deletion
        this.editPatientFormVisible = false;  // Hide edit form after deletion
      }
    }
  }

  // Logout function
  async logout() {
    await this.supabaseService.logout();
    this.router.navigate(['/login']);
  }

  onSearchChange(query: string) {
    this.searchQuery = query.toLowerCase();
    this.filteredPatients = this.patients.filter(patient =>
      patient.name.toLowerCase().includes(this.searchQuery) ||
      patient.mobile.includes(this.searchQuery) // Add other fields as needed
    );
  }

  sendBulkSMS() {
    this.showDynamicData = false;
    this.showPatients = false;  // Hide patient list
    this.newPatient = false;  // Show new patient form
    this.bulksms=true;
    this.editPatientFormVisible = false;
    }
}
