import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((com) => com.LoginComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (com) => com.DashboardComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'patient/:id', // Dynamic patient details route
    loadComponent: () =>
      import('./patient-details/patient-details.component').then(
        (com) => com.PatientDetailsComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'add-patient', // New route for adding a patient
    loadComponent: () =>
      import('./new-patient/new-patient.component').then(
        (com) => com.NewPatientComponent
      ),
    canActivate: [AuthGuard], // Ensure that only authenticated users can access
  },
  {
    path: 'bulksms', // New route for adding a patient
    loadComponent: () =>
      import('./send-bulk-sms/send-bulk-sms.component').then(
        (com) => com.SendBulkSmsComponent
      ),
    canActivate: [AuthGuard], // Ensure that only authenticated users can access
  },
  
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
