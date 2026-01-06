import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRole = route.data['role'];
    const userRole = this.authService.getUserRole();
    
    console.log('RoleGuard - Required role:', requiredRole);
    console.log('RoleGuard - User role:', userRole);
    console.log('RoleGuard - Is authenticated:', this.authService.isAuthenticated());
    
    if (this.authService.isAuthenticated() && userRole === requiredRole) {
      console.log('RoleGuard - Access granted');
      return true;
    }
    
    console.log('RoleGuard - Access denied, redirecting to unauthorized');
    this.router.navigate(['/unauthorized']);
    return false;
  }
}