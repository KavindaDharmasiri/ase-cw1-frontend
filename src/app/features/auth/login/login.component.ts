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
    <div class="auth-container slide-up">
      <div class="auth-background">
        <div class="floating-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
        </div>
      </div>

      <div class="auth-card glass">
        <div class="auth-header fade-in">
          <div class="logo">
            <img src="logo.png" alt="IslandLink Logo" class="icon-lg pulse">
            <h1 class="gradient-text">IslandLink</h1>
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to access your ISDN dashboard</p>
        </div>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="auth-form">
          <div class="form-group slide-up">
            <label class="form-label">
              <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              Username
            </label>
            <div class="input-container">
              <input type="text" class="form-input" [(ngModel)]="loginData.username" name="username" required
                     placeholder="Enter your username">
              <div class="input-focus-border"></div>
            </div>
          </div>

          <div class="form-group slide-up">
            <label class="form-label">
              <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 17a2 2 0 0 0 2-2c0-1.11-.89-2-2-2a2 2 0 0 0-2 2c0 1.11.89 2 2 2m6-9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5 5 5 0 0 1 5 5v2h1m-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3Z"/>
              </svg>
              Password
            </label>
            <div class="input-container">
              <input type="password" class="form-input" [(ngModel)]="loginData.password" name="password" required
                     placeholder="Enter your password">
              <div class="input-focus-border"></div>
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-full slide-up" [disabled]="!loginForm.form.valid">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor" *ngIf="!isLoading">
              <path d="M10 17l5-5-5-5v10z"/>
            </svg>
            <div class="spinner" *ngIf="isLoading"></div>
            {{ isLoading ? 'Signing In...' : 'Sign In' }}
          </button>

          <div *ngIf="message" class="alert alert-error slide-up">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            {{ message }}
          </div>
        </form>

        <div class="auth-footer fade-in">
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
      position: relative;
      overflow: hidden;
    }

    .auth-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg,
        var(--primary-blue) 0%,
        var(--secondary-green) 50%,
        var(--accent-purple) 100%);
      z-index: -1;
    }

    .floating-shapes {
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .shape {
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.1);
      animation: float 6s ease-in-out infinite;
    }

    .shape-1 {
      width: 80px;
      height: 80px;
      top: 20%;
      left: 10%;
      animation-delay: 0s;
    }

    .shape-2 {
      width: 120px;
      height: 120px;
      top: 60%;
      right: 10%;
      animation-delay: 2s;
    }

    .shape-3 {
      width: 60px;
      height: 60px;
      bottom: 20%;
      left: 20%;
      animation-delay: 4s;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px) rotate(0deg);
      }
      50% {
        transform: translateY(-20px) rotate(180deg);
      }
    }

    .auth-card {
      background: rgba(255, 255, 255, 0.95);
      border-radius: var(--border-radius-xl);
      box-shadow: var(--shadow-xl);
      padding: 48px;
      width: 100%;
      max-width: 480px;
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      position: relative;
      overflow: hidden;
    }

    .auth-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--primary-blue), var(--secondary-green), var(--accent-purple));
    }

    .auth-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .logo h1 {
      font-size: 32px;
      font-weight: 700;
      margin: 0;
      letter-spacing: -1px;
    }

    .icon-lg {
      width: 60px;
      height: 60px;
      object-fit: contain;
    }

    .auth-header h2 {
      color: var(--gray-800);
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 12px;
      letter-spacing: -0.5px;
    }

    .auth-header p {
      color: var(--gray-600);
      font-size: 16px;
      margin: 0;
    }

    .form-group {
      margin-bottom: 24px;
    }

    .form-label {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--gray-700);
      font-weight: 600;
      margin-bottom: 8px;
      font-size: 15px;
    }

    .input-container {
      position: relative;
    }

    .form-input {
      width: 100%;
      padding: 16px 20px;
      border: 2px solid var(--gray-200);
      border-radius: var(--border-radius-lg);
      font-size: 16px;
      transition: all var(--transition-fast);
      background: rgba(255,255,255,0.8);
      backdrop-filter: blur(10px);
    }

    .form-input:hover {
      border-color: var(--gray-300);
      background: rgba(255,255,255,0.9);
    }

    .form-input:focus {
      outline: none;
      border-color: var(--primary-blue);
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
      background: white;
      transform: scale(1.02);
    }

    .input-focus-border {
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, var(--primary-blue), var(--secondary-green));
      transition: all var(--transition-normal);
      transform: translateX(-50%);
    }

    .form-input:focus + .input-focus-border {
      width: 100%;
    }

    .btn-full {
      width: 100%;
      justify-content: center;
      padding: 18px;
      font-size: 16px;
      font-weight: 600;
      margin-top: 12px;
      border-radius: var(--border-radius-lg);
      background: linear-gradient(135deg, var(--primary-blue), var(--secondary-green));
      position: relative;
      overflow: hidden;
    }

    .btn-full:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
    }

    .btn-full:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .auth-footer {
      text-align: center;
      margin-top: 32px;
      padding-top: 32px;
      border-top: 1px solid var(--gray-200);
    }

    .auth-footer p {
      margin: 8px 0;
      color: var(--gray-600);
    }

    .link {
      color: var(--secondary-green);
      text-decoration: none;
      font-weight: 600;
      transition: all var(--transition-fast);
      position: relative;
    }

    .link::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--secondary-green);
      transition: width var(--transition-normal);
    }

    .link:hover::after {
      width: 100%;
    }

    .link:hover {
      color: var(--secondary-green-light);
    }

    @media (max-width: 768px) {
      .auth-card {
        padding: 32px 24px;
        margin: 16px;
      }

      .logo h1 {
        font-size: 28px;
      }

      .auth-header h2 {
        font-size: 24px;
      }
    }
  `]
})
export class LoginComponent {
  loginData: LoginRequest = {
    username: '',
    password: ''
  };

  message = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.isLoading = true;
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
          showConfirmButton: false,
          background: 'rgba(255, 255, 255, 0.95)',
          backdrop: 'rgba(0, 0, 0, 0.4)'
        }).then(() => {
          this.isLoading = false;
          // Small delay to ensure data is stored
          setTimeout(() => {
            this.router.navigate([redirectPath]);
          }, 100);
        });
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: error.error?.message || 'Invalid credentials. Please try again.',
          background: 'rgba(255, 255, 255, 0.95)',
          backdrop: 'rgba(0, 0, 0, 0.4)'
        });
      }
    });
  }
}
