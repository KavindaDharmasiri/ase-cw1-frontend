import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h2>Reset Password</h2>
          <p>Enter your new password</p>
        </div>
        
        <form (ngSubmit)="onSubmit()" #resetForm="ngForm" class="auth-form">
          <div class="form-group">
            <label class="form-label">New Password</label>
            <input type="password" class="form-input" [(ngModel)]="newPassword" name="newPassword" required minlength="6" placeholder="Enter new password">
          </div>
          
          <div class="form-group">
            <label class="form-label">Confirm Password</label>
            <input type="password" class="form-input" [(ngModel)]="confirmPassword" name="confirmPassword" required placeholder="Confirm new password">
          </div>
          
          <button type="submit" class="btn btn-primary btn-full" [disabled]="!resetForm.form.valid || newPassword !== confirmPassword">
            Reset Password
          </button>
          
          <div *ngIf="newPassword !== confirmPassword && confirmPassword" class="alert alert-error">
            Passwords do not match
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; background: linear-gradient(135deg, #059669 0%, #10b981 100%); }
    .auth-card { background: white; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); padding: 40px; width: 100%; max-width: 450px; }
    .auth-header { text-align: center; margin-bottom: 32px; }
    .btn-full { width: 100%; justify-content: center; padding: 16px; font-size: 16px; font-weight: 600; margin-top: 8px; }
    .alert-error { background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid rgba(239,68,68,0.2); padding: 12px; border-radius: 8px; margin-top: 16px; }
  `]
})
export class ResetPasswordComponent implements OnInit {
  token = '';
  newPassword = '';
  confirmPassword = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'] || '';
    if (!this.token) {
      Swal.fire('Error!', 'Invalid reset token', 'error');
      this.router.navigate(['/login']);
    }
  }

  onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      Swal.fire('Error!', 'Passwords do not match', 'error');
      return;
    }

    this.http.post('http://localhost:5000/api/auth/reset-password', {
      token: this.token,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        Swal.fire('Success!', 'Password reset successfully', 'success').then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (error) => {
        Swal.fire('Error!', error.error || 'Failed to reset password', 'error');
      }
    });
  }
}