import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './service/auth.service';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const user = await this.authService.getUser();
    if (!user) {
      // If no user is logged in, redirect to the login page
      this.router.navigate(['/login']);
      return false;
    }
    return true;  // User is authenticated, allow access to the route
  }
}
