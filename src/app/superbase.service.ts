import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment.development';


@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    // Initialize Supabase client
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.key
    );
  }

  // Authentication Methods
  async login(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  async getUser() {
    return this.supabase.auth.getUser();
  }

  async logout() {
    return this.supabase.auth.signOut();
  }

  // ----------------------
  // Patient Data Functions
  // ----------------------

  // Fetch all static patient data
  async getStaticPatients() {
    return this.supabase.from('static_patient_data').select('*');
  }

  async searchPatients(query: string) {
    // Construct a query that looks for matches in name, district, or clinic
    const { data, error } = await this.supabase
      .from('static_patient_data')
      .select('*')
      .ilike('name', `%${query}%`) // Searches for name (case insensitive)
      .or(`district.ilike.%${query}%,clinic.ilike.%${query}%`); // Optionally search district or clinic as well
    
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  // Fetch all dynamic patient data linked to a specific patient
  async getDynamicData(patientId: string) {
    return this.supabase
      .from('dynamic_patient_data')
      .select('*')
      .eq('patient_id', patientId);
  }

  // Fetch static patient data with dynamic data
  async getPatientWithDynamicData(patientId: string) {
    return this.supabase
      .from('static_patient_data')
      .select(`*, dynamic_patient_data(*)`)
      .eq('id', patientId);
  }

  // Add a new patient to static_patient_data
  async addStaticPatient(patientData: any) {
    return this.supabase.from('static_patient_data').insert(patientData);
  }

  // Add new dynamic data for a patient
  async addDynamicData(dynamicData: any) {
    return this.supabase.from('dynamic_patient_data').insert(dynamicData);
  }

  // Update static patient data by ID
  async updateStaticPatient(patientId: string, updatedData: any) {
    return this.supabase
      .from('static_patient_data')
      .update(updatedData)
      .eq('id', patientId);
  }

  // Update dynamic patient data by ID
  async updateDynamicData(dynamicId: string, updatedData: any) {
    return this.supabase
      .from('dynamic_patient_data')
      .update(updatedData)
      .eq('id', dynamicId);
  }

  // Delete a patient and their associated dynamic data
  async deletePatient(patientId: string) {
    return this.supabase.from('static_patient_data').delete().eq('id', patientId);
  }

  // Fetch lab results for a specific patient
// Fetch all lab results


async getLabResultsForPatient(patientId: string) {
  return this.supabase
    .from('labresults')
    .select('*')
    .eq('patient_id', patientId);  // Filter lab results by patient_id
}


}
