import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupabaseService } from '../superbase.service';
import { CommonModule } from '@angular/common';
import { NewPatientComponent } from "../new-patient/new-patient.component";
import { SendBulkSmsComponent } from "../send-bulk-sms/send-bulk-sms.component";
import { NewLabResultsComponent } from "../new-lab-results/new-lab-results.component";
import Swal from 'sweetalert2';
import { MakeCallComponent } from '../makecall/makecall.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, ReactiveFormsModule,MakeCallComponent, NewPatientComponent, SendBulkSmsComponent,  NewLabResultsComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {


showmakecall:boolean=false;
  labResultForselectedpatient:boolean=false;
newlabresults:boolean=false;
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
  labresults:boolean=false;
  AllLabResults: any[] = [];

  deletedPatientAlert = false;  // Corrected variable name

  searchQuery: string = ''; // Added search query
labForselectedPatient: any;


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

resetviews(){
  this.showmakecall=false;
  this.labResultForselectedpatient=false;
  this.newlabresults=false;
  this.showPatients = true;  // Ensures that patient list is shown by default
  this.newPatient = false;
  this.editPatientFormVisible = false;
  this.showDynamicData = false;
  this.editedPatient = false;
  this.deletedpatientAlert=false;
  this.bulksms=false;
  this.makecall=false;
  this.labresults=false;
  this.deletedPatientAlert = false;  // Corrected variable name
}

  // Fetch all static patients data
  async loadPatients() {
    this.resetviews();
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
    this.resetviews();
    this.selectedPatient = patient;
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


    this.editPatientFormVisible = true;
    this.showPatients=false;
  }

  // Handle form submission for saving changes
  async onSubmitEdit() {
    this.resetviews();
    try {
      const updatedData = this.editPatientForm.value;
      const { error } = await this.supabaseService.updateStaticPatient(this.selectedPatient.id, updatedData);
      if (error) {
        console.error('Error updating patient:', error);
      } else {
        this.resetviews();
        this.editedPatient = true; 
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
    this.resetviews();
    this.showPatients=false;
    this.selectedPatient = this.patients.find((p) => p.id === patientId);
      
    const { data, error } = await this.supabaseService.getDynamicData(patientId);
    if (error) {
      console.error('Error fetching dynamic data:', error);
    } else {
      this.dynamicData = data || [];
    }
  }

  // Function to reset the view to show patients list only
  showAllPatients() {
    this.resetviews();
    this.showPatients = true; // Show the patient list
    this.selectedPatient = null; // Reset selected patient
    this.dynamicData = []; // Clear dynamic data
   
  }

  // Function to navigate to the new patient form
  navigateToAddPatient() {
    this.resetviews();
    this.newPatient = true; 
  }

  // Delete patient function
  async onDeletePatient() {
    if (confirm('Are you sure you want to delete this patient?')) {
      const { error } = await this.supabaseService.deletePatient(this.selectedPatient.id);
      if (error) {
        console.error('Error deleting patient:', error);
      } else {
        this.resetviews();
        this.showPatients=false;
        this.deletedpatientAlert=true;
        this.selectedPatient = null; 
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
      patient.mobile.includes(this.searchQuery)
    );
  }

  sendBulkSMS() {
    this.resetviews();
    this.showPatients=false;
    this.bulksms=true;
  
    
    }

/*     callSelectedPatient(arg0: any) {
           Swal.fire({  
              
        html: `<p>Make new Call to <p><p class="text-success"> <strong>${this.selectedPatient.name}</strong></p><h3 class="text-secondary"> TEL : <span class="text-dark"> ${this.selectedPatient.mobile} </span> </h3>`,  
        icon: 'warning',  
        confirmButtonText: 'Okay'  
    }); 
      } */
    callSelectedPatient(patientId: string) {
      this.supabaseService.selectedPatientId.set(patientId);
      this.resetviews();
      this.showmakecall=true;
      this.showDynamicData=false;
      this.showPatients=false;
      
     
    }

      showlabresults() {
        this.resetviews();
       this.labresults=true;
      
       this.loadLabResults(this.selectedPatient.id);
        }

        showalllabresults() {
          this.resetviews();
         this.labresults=true;
        
         this.loadAllLabResults();
          }
        
  
        selectedPatientLabResults: any[] = [];

        
        loadAllLabResults() {
          this.resetviews();
          this.labResultForselectedpatient = true;  // Keep lab results flag true to show the lab results section
          this.fetchAllLabResults();  // Fetch the lab results for the selected patient
        }

        loadLabResults(patientId: number) {
          this.resetviews();
          this.labResultForselectedpatient = true;  // Keep lab results flag true to show the lab results section
          this.fetchLabResults(patientId);  // Fetch the lab results for the selected patient
        }
      
 

        async fetchLabResults(patientId: number) {
          const { data, error } = await this.supabaseService.getLabResultsForPatient(patientId.toString());
          if (error) {
            console.error('Error fetching lab results:', error);
          } else {
            this.selectedPatientLabResults = data || [];
          }
        }
        

        async fetchAllLabResults() {
          const { data, error } = await this.supabaseService.getAllLabResults()
          if (error) {
            console.error('Error fetching lab results:', error);
          } else {
            this.AllLabResults = data || [];
          }
        }
          
}
