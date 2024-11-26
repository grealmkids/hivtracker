import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule, RouterModule, CommonModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    // Redirect if user is already logged in
    this.checkIfLoggedIn();
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(7)]],
    });
  }

  private async checkIfLoggedIn() {
    try {
      const user = await this.auth.getUser(); // Wait for the Promise to resolve
      if (user) {
        this.router.navigate(['/dashboard']);
      }
    } catch (error) {
      console.error('Error checking user login status:', error);
    }
  }

  public onSubmit(): void {
    if (this.loginForm.invalid)
      console.log(`------------------------- Wrong Credentials`);

    this.auth
      .signIn(this.loginForm.value.email, this.loginForm.value.password)
      .then((res) => {
        if (res.data.user && res.data.user.role === 'authenticated') {
          this.router.navigate(['/dashboard']);
        }
      })
      .catch((err) => {
        console.log(`------------------------- Wrong Credentials`);
      });
  }
}
