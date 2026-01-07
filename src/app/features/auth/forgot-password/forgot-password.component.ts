import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h2>Forgot Password</h2>
          <p>Enter your email to receive a password reset link</p>
        </div>
        
        <form (ngSubmit)="onSubmit()" #forgotForm="ngForm" class="auth-form">
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" class="form-input" [(ngModel)]="email" name="email" required placeholder="Enter your email">
          </div>
          
          <button type="submit" class="btn btn-primary btn-full" [disabled]="!forgotForm.form.valid">
            Send Reset Link
          </button>
        </form>
        
        <div class="auth-footer">
          <p>Remember your password? <a routerLink="/login" class="link">Sign in</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; background: linear-gradient(135deg, #059669 0%, #10b981 100%); }
    .auth-card { background: white; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); padding: 40px; width: 100%; max-width: 450px; }
    .auth-header { text-align: center; margin-bottom: 32px; }
    .btn-full { width: 100%; justify-content: center; padding: 16px; font-size: 16px; font-weight: 600; margin-top: 8px; }
    .auth-footer { text-align: center; margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb; }
    .link { color: #059669; text-decoration: none; font-weight: 500; }
  `]
})
export class ForgotPasswordComponent {
  email = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.http.post('http://localhost:5000/api/auth/forgot-password', { email: this.email }).subscribe({
      next: () => {
        Swal.fire('Success!', 'Password reset link sent to your email', 'success');
      },
      error: (error) => {
        Swal.fire('Error!', error.error || 'Failed to send reset link', 'error');
      }
    });
  }
}