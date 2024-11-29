import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../superbase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-details',
  imports:[CommonModule],
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css'],
})
export class PatientDetailsComponent implements OnInit {
  patientId: string | null = null;
  patientData: any = null;
  dynamicData: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private supabaseService: SupabaseService
  ) {}

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('id');
    if (this.patientId) {
      this.loadPatientData(this.patientId);
    }
  }

  async loadPatientData(id: string) {
    const { data, error } = await this.supabaseService.getPatientWithDynamicData(id);
    if (error) {
      console.error('Error fetching patient details:', error);
    } else {
      this.patientData = data[0]; // Assuming `getPatientWithDynamicData` returns an array
      this.dynamicData = this.patientData.dynamic_patient_data || [];
      
    }
  }
}
