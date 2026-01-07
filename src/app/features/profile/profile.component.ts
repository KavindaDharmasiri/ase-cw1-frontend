import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-container">
      <h1>👤 Profile Management</h1>
      
      <div class="profile-card">
        <form (ngSubmit)="updateProfile()" #profileForm="ngForm">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" class="form-input" [(ngModel)]="profile.fullName" name="fullName" required>
          </div>
          
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" class="form-input" [(ngModel)]="profile.email" name="email" required>
          </div>
          
          <div class="form-group">
            <label class="form-label">Username</label>
            <input type="text" class="form-input" [value]="profile.username" disabled>
          </div>
          
          <div class="form-group">
            <label class="form-label">Role</label>
            <input type="text" class="form-input" [value]="profile.role" disabled>
          </div>
          
          <button type="submit" class="btn btn-primary" [disabled]="!profileForm.form.valid">
            Update Profile
          </button>
        </form>
      </div>
      
      <div class="password-section">
        <h2>Change Password</h2>
        <button (click)="requestPasswordReset()" class="btn btn-secondary">
          Send Password Reset Email
        </button>
      </div>
    </div>
  `,
  styles: [`
    .profile-container { padding: 20px; max-width: 600px; margin: 0 auto; }
    .profile-card { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 30px; }
    .password-section { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .form-group { margin-bottom: 20px; }
    .form-label { display: block; margin-bottom: 6px; font-weight: 500; color: #374151; }
    .form-input { width: 100%; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; }
    .form-input:disabled { background: #f9fafb; color: #6b7280; }
    .btn { padding: 12px 24px; border: none; border-radius: 8px; font-weight: 500; cursor: pointer; }
    .btn-primary { background: #3b82f6; color: white; }
    .btn-secondary { background: #6b7280; color: white; }
  `]
})
export class ProfileComponent implements OnInit {
  profile = {
    fullName: '',
    email: '',
    username: '',
    role: ''
  };

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    const userInfo = localStorage.getItem('user_info');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      this.profile = {
        fullName: user.fullName || user.username,
        email: user.email,
        username: user.username,
        role: user.role
      };
    }
  }

  updateProfile() {
    const userId = JSON.parse(localStorage.getItem('user_info') || '{}').id;
    
    this.http.put(`http://localhost:5000/api/auth/profile/${userId}`, {
      fullName: this.profile.fullName,
      email: this.profile.email
    }).subscribe({
      next: () => {
        Swal.fire('Success!', 'Profile updated successfully', 'success');
        // Update local storage
        const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
        userInfo.fullName = this.profile.fullName;
        userInfo.email = this.profile.email;
        localStorage.setItem('user_info', JSON.stringify(userInfo));
      },
      error: (error) => {
        Swal.fire('Error!', error.error || 'Failed to update profile', 'error');
      }
    });
  }

  requestPasswordReset() {
    this.http.post('http://localhost:5000/api/auth/forgot-password', {
      email: this.profile.email
    }).subscribe({
      next: () => {
        Swal.fire('Success!', 'Password reset link sent to your email', 'success');
      },
      error: (error) => {
        Swal.fire('Error!', error.error || 'Failed to send reset link', 'error');
      }
    });
  }
}