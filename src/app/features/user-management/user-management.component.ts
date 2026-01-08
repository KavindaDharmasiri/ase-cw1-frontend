import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>User Management</h2>
      
      <div class="tabs">
        <button [class.active]="activeTab === 'create'" (click)="activeTab = 'create'">Create User</button>
        <button [class.active]="activeTab === 'list'" (click)="activeTab = 'list'">User List</button>
      </div>
      
      <!-- Create User Tab -->
      <div *ngIf="activeTab === 'create'" class="tab-content">
        <form (ngSubmit)="onSubmit()" #userForm="ngForm">
          <div class="form-row">
            <div class="form-group">
              <label>Username *</label>
              <input type="text" [(ngModel)]="user.username" name="username" required class="form-control">
            </div>
            <div class="form-group">
              <label>Email *</label>
              <input type="email" [(ngModel)]="user.email" name="email" required class="form-control">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Full Name *</label>
              <input type="text" [(ngModel)]="user.fullName" name="fullName" required class="form-control">
            </div>
            <div class="form-group">
              <label>Password *</label>
              <input type="password" [(ngModel)]="user.password" name="password" required class="form-control">
            </div>
          </div>
          
          <div class="form-group">
            <label>Role *</label>
            <select [(ngModel)]="user.role" name="role" required class="form-control">
              <option value="">Select Role</option>
              <option value="RETAILER">Retailer</option>
              <option value="RDC_STAFF">RDC Staff</option>
              <option value="LOGISTICS">Logistics</option>
              <option value="HEAD_OFFICE_MANAGER">Head Office Manager</option>
            </select>
          </div>
          
          <!-- Customer-specific fields for RETAILER -->
          <div *ngIf="user.role === 'RETAILER'" class="customer-section">
            <h3>Customer Details</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label>Business Type</label>
                <select [(ngModel)]="user.businessType" name="businessType" class="form-control">
                  <option value="">Select Type</option>
                  <option value="RETAIL">Retail</option>
                  <option value="SUPERMARKET">Supermarket</option>
                  <option value="RESELLER">Reseller</option>
                </select>
              </div>
              <div class="form-group">
                <label>District</label>
                <select [(ngModel)]="user.district" name="district" class="form-control">
                  <option value="">Select District</option>
                  <option *ngFor="let district of districts" [value]="district">{{district}}</option>
                </select>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Assigned RDC</label>
                <select [(ngModel)]="user.servicingRdcId" name="servicingRdcId" class="form-control">
                  <option value="">Select RDC</option>
                  <option *ngFor="let rdc of rdcs" [value]="rdc.id">{{rdc.name}}</option>
                </select>
              </div>
              <div class="form-group">
                <label>Payment Method</label>
                <select [(ngModel)]="user.paymentType" name="paymentType" class="form-control">
                  <option value="">Select Method</option>
                  <option value="CASH">Cash</option>
                  <option value="CREDIT">Credit</option>
                </select>
              </div>
            </div>
            
            <div class="form-group" *ngIf="user.paymentType === 'CREDIT'">
              <label>Credit Limit</label>
              <input type="number" [(ngModel)]="user.creditLimit" name="creditLimit" class="form-control" min="0" step="0.01">
            </div>
            
            <div class="form-group">
              <label>Delivery Address</label>
              <textarea [(ngModel)]="user.deliveryAddress" name="deliveryAddress" class="form-control" rows="2"></textarea>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Contact Person</label>
                <input type="text" [(ngModel)]="user.contactPerson" name="contactPerson" class="form-control">
              </div>
              <div class="form-group">
                <label>Phone</label>
                <input type="tel" [(ngModel)]="user.phone" name="phone" class="form-control">
              </div>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="submit" [disabled]="!userForm.form.valid || loading" class="btn btn-primary">
              {{loading ? 'Creating...' : 'Create User'}}
            </button>
            <button type="button" (click)="resetForm()" class="btn btn-secondary">Reset</button>
          </div>
        </form>
      </div>
      
      <!-- User List Tab -->
      <div *ngIf="activeTab === 'list'" class="tab-content">
        <div class="user-list">
          <div class="user-card" *ngFor="let u of users">
            <div class="user-info">
              <h4>{{u.fullName}}</h4>
              <p>{{u.username}} | {{u.email}}</p>
              <span class="role-badge" [class]="u.role.name">{{u.role.name}}</span>
            </div>
            <div class="user-actions">
              <button class="btn btn-sm btn-danger" (click)="deleteUser(u.id)">Delete</button>
            </div>
          </div>
        </div>
      </div>
      
      <div *ngIf="message" class="alert" [class.alert-success]="!error" [class.alert-danger]="error">
        {{message}}
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 1000px; margin: 20px auto; padding: 20px; }
    .tabs { display: flex; margin-bottom: 20px; border-bottom: 1px solid #ddd; }
    .tabs button { padding: 10px 20px; border: none; background: none; cursor: pointer; }
    .tabs button.active { border-bottom: 2px solid #007bff; color: #007bff; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .form-group { margin-bottom: 15px; }
    .form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
    .form-control { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
    .customer-section { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; }
    .form-actions { margin-top: 20px; }
    .btn { padding: 10px 20px; margin-right: 10px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-primary { background-color: #007bff; color: white; }
    .btn-secondary { background-color: #6c757d; color: white; }
    .btn-danger { background-color: #dc3545; color: white; }
    .btn-sm { padding: 5px 10px; font-size: 12px; }
    .user-list { display: grid; gap: 15px; }
    .user-card { display: flex; justify-content: space-between; align-items: center; padding: 15px; border: 1px solid #ddd; border-radius: 4px; }
    .role-badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
    .role-badge.RETAILER { background: #e3f2fd; color: #1976d2; }
    .role-badge.RDC_STAFF { background: #f3e5f5; color: #7b1fa2; }
    .role-badge.LOGISTICS { background: #e8f5e8; color: #388e3c; }
    .role-badge.HEAD_OFFICE_MANAGER { background: #fff3e0; color: #f57c00; }
    .alert { padding: 10px; margin-top: 15px; border-radius: 4px; }
    .alert-success { background-color: #d4edda; color: #155724; }
    .alert-danger { background-color: #f8d7da; color: #721c24; }
  `]
})
export class UserManagementComponent {
  activeTab = 'create';
  
  user = {
    username: '',
    email: '',
    password: '',
    fullName: '',
    role: '',
    businessType: '',
    district: '',
    servicingRdcId: null,
    paymentType: '',
    creditLimit: null,
    deliveryAddress: '',
    contactPerson: '',
    phone: ''
  };

  users: any[] = [];
  districts = ['Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya', 'Galle', 'Matara', 'Hambantota'];
  rdcs = [
    { id: 1, name: 'Colombo RDC' },
    { id: 2, name: 'Kandy RDC' },
    { id: 3, name: 'Galle RDC' }
  ];
  
  loading = false;
  message = '';
  error = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.loadUsers();
  }

  onSubmit() {
    this.loading = true;
    this.message = '';
    
    this.authService.register(this.user).subscribe({
      next: (response) => {
        this.loading = false;
        this.message = 'User created successfully!';
        this.error = false;
        this.resetForm();
        this.loadUsers();
      },
      error: (error) => {
        this.loading = false;
        this.message = error.error?.message || 'Failed to create user';
        this.error = true;
      }
    });
  }

  resetForm() {
    this.user = {
      username: '',
      email: '',
      password: '',
      fullName: '',
      role: '',
      businessType: '',
      district: '',
      servicingRdcId: null,
      paymentType: '',
      creditLimit: null,
      deliveryAddress: '',
      contactPerson: '',
      phone: ''
    };
  }

  loadUsers() {
    // Mock users - replace with actual service call
    this.users = [];
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      // Implement delete functionality
      this.message = 'User deleted successfully!';
      this.error = false;
    }
  }
}