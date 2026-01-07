import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

interface LoginRequest {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo">
            <svg class="icon-lg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <h1>IslandLink</h1>
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to access your ISDN dashboard</p>
        </div>
        
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="auth-form">
          <div class="form-group">
            <label class="form-label">
              <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              Username
            </label>
            <input type="text" class="form-input" [(ngModel)]="loginData.username" name="username" required placeholder="Enter your username">
          </div>
          
          <div class="form-group">
            <label class="form-label">
              <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 17a2 2 0 0 0 2-2c0-1.11-.89-2-2-2a2 2 0 0 0-2 2c0 1.11.89 2 2 2m6-9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5 5 5 0 0 1 5 5v2h1m-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3Z"/>
              </svg>
              Password
            </label>
            <input type="password" class="form-input" [(ngModel)]="loginData.password" name="password" required placeholder="Enter your password">
          </div>
          
          <button type="submit" class="btn btn-primary btn-full" [disabled]="!loginForm.form.valid">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 17l5-5-5-5v10z"/>
            </svg>
            Sign In
          </button>
          
          <div *ngIf="message" class="alert alert-error">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            {{ message }}
          </div>
        </form>
        
        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/register" class="link">Create account</a></p>
          <p><a routerLink="/forgot-password" class="link">Forgot your password?</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: linear-gradient(135deg, var(--secondary-green) 0%, var(--secondary-green-light) 100%);
    }
    
    .auth-card {
      background: white;
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-lg);
      padding: 40px;
      width: 100%;
      max-width: 450px;
    }
    
    .auth-header {
      text-align: center;
      margin-bottom: 32px;
    }
    
    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 16px;
    }
    
    .logo h1 {
      color: var(--secondary-green);
      font-size: 28px;
      font-weight: 700;
    }
    
    .icon-lg {
      width: 32px;
      height: 32px;
      color: var(--secondary-green);
    }
    
    .auth-header h2 {
      color: var(--gray-800);
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .auth-header p {
      color: var(--gray-600);
      font-size: 14px;
    }
    
    .form-label {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--gray-700);
      font-weight: 500;
      margin-bottom: 6px;
    }
    
    .btn-full {
      width: 100%;
      justify-content: center;
      padding: 16px;
      font-size: 16px;
      font-weight: 600;
      margin-top: 8px;
    }
    
    .auth-footer {
      text-align: center;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid var(--gray-200);
    }
    
    .link {
      color: var(--secondary-green);
      text-decoration: none;
      font-weight: 500;
    }
    
    .link:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  loginData: LoginRequest = {
    username: '',
    password: ''
  };
  
  message = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        console.log('Login successful, response:', response);
        
        // Determine redirect path based on role
        const userRole = response.role;
        let redirectPath = '/dashboard';
        
        switch(userRole) {
          case 'RETAILER':
            redirectPath = '/retailer';
            break;
          case 'RDC_STAFF':
            redirectPath = '/rdc-staff';
            break;
          case 'LOGISTICS':
            redirectPath = '/logistics';
            break;
          case 'HEAD_OFFICE_MANAGER':
            redirectPath = '/head-office';
            break;
        }
        
        console.log('Redirecting to:', redirectPath);
        
        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: `Welcome back, ${response.username}!`,
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          // Small delay to ensure data is stored
          setTimeout(() => {
            this.router.navigate([redirectPath]);
          }, 100);
        });
      },
      error: (error) => {
        console.error('Login failed:', error);
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: error.error?.message || 'Invalid credentials. Please try again.'
        });
      }
    });
  }
}