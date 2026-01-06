import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role: string;
}

@Component({
  selector: 'app-register',
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
          <h2>Create Account</h2>
          <p>Join the ISDN network and start managing your distribution operations</p>
        </div>
        
        <form (ngSubmit)="onSubmit()" #registerForm="ngForm" class="auth-form">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">
                <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                Username
              </label>
              <input type="text" class="form-input" [(ngModel)]="registerData.username" name="username" required>
            </div>
            
            <div class="form-group">
              <label class="form-label">
                <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                Email
              </label>
              <input type="email" class="form-input" [(ngModel)]="registerData.email" name="email" required>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">
              <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H19V9Z"/>
              </svg>
              Full Name
            </label>
            <input type="text" class="form-input" [(ngModel)]="registerData.fullName" name="fullName" required>
          </div>
          
          <div class="form-group">
            <label class="form-label">
              <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Role
            </label>
            <select class="form-select" [(ngModel)]="registerData.role" name="role" required>
              <option value="">Select Your Role</option>
              <option value="RETAILER">🏪 Retailer</option>
              <option value="RDC_STAFF">🏢 RDC Staff</option>
              <option value="LOGISTICS">🚛 Logistics</option>
              <option value="HEAD_OFFICE_MANAGER">👔 Head Office Manager</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">
              <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 17a2 2 0 0 0 2-2c0-1.11-.89-2-2-2a2 2 0 0 0-2 2c0 1.11.89 2 2 2m6-9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5 5 5 0 0 1 5 5v2h1m-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3Z"/>
              </svg>
              Password
            </label>
            <input type="password" class="form-input" [(ngModel)]="registerData.password" name="password" required>
          </div>
          
          <button type="submit" class="btn btn-primary btn-full" [disabled]="!registerForm.form.valid">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Create Account
          </button>
          
          <div *ngIf="message" class="alert" [ngClass]="{'alert-error': isError, 'alert-success': !isError}">
            {{ message }}
          </div>
        </form>
        
        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login" class="link">Sign in</a></p>
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
      background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%);
    }
    
    .auth-card {
      background: white;
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-lg);
      padding: 40px;
      width: 100%;
      max-width: 500px;
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
      color: var(--primary-blue);
      font-size: 28px;
      font-weight: 700;
    }
    
    .icon-lg {
      width: 32px;
      height: 32px;
      color: var(--primary-blue);
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
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
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
    }
    
    .auth-footer {
      text-align: center;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid var(--gray-200);
    }
    
    .link {
      color: var(--primary-blue);
      text-decoration: none;
      font-weight: 500;
    }
    
    .link:hover {
      text-decoration: underline;
    }
    
    @media (max-width: 640px) {
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .auth-card {
        padding: 24px;
      }
    }
  `]
})
export class RegisterComponent {
  registerData: RegisterRequest = {
    username: '',
    email: '',
    password: '',
    fullName: '',
    role: ''
  };
  
  message = '';
  isError = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: 'Your account has been created successfully.',
          confirmButtonText: 'Go to Login'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: error.error?.message || 'Please try again later.'
        });
      }
    });
  }
}