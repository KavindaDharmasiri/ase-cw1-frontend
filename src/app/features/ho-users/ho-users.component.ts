import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ho-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ho-users">
      <div class="header">
        <h1>User & Role Management</h1>
        <button class="create-btn" (click)="showCreateUser = true">Create New User</button>
      </div>

      <div class="user-stats">
        <div class="stat-card">
          <h3>Total Users</h3>
          <div class="stat-value">{{totalUsers}}</div>
          <small>Debug: {{users.length}} users loaded</small>
        </div>
        <div class="stat-card">
          <h3>Active Users</h3>
          <div class="stat-value">{{activeUsers}}</div>
        </div>
        <div class="stat-card">
          <h3>RDC Staff</h3>
          <div class="stat-value">{{rdcStaffCount}}</div>
        </div>
        <div class="stat-card">
          <h3>Logistics</h3>
          <div class="stat-value">{{logisticsCount}}</div>
        </div>
      </div>

      <div class="filters">
        <select [(ngModel)]="selectedRole" class="filter-select">
          <option value="">All Roles</option>
          <option value="RDC_STAFF">RDC Staff</option>
          <option value="LOGISTICS">Logistics</option>
          <option value="HEAD_OFFICE_MANAGER">HO Manager</option>
        </select>
        <select [(ngModel)]="selectedRdc" class="filter-select">
          <option value="">All RDCs</option>
          <option value="Colombo">Colombo RDC</option>
          <option value="Kandy">Kandy RDC</option>
          <option value="Galle">Galle RDC</option>
        </select>
        <input type="text" [(ngModel)]="searchTerm" placeholder="Search users..." class="search-input">
      </div>

      <div class="users-table">
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>RDC</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of filteredUsers">
              <td>{{user.id}}</td>
              <td>{{user.fullName}}</td>
              <td>{{user.email}}</td>
              <td>
                <span class="role-badge" [class]="user.role.toLowerCase()">{{user.role}}</span>
              </td>
              <td>{{user.rdc}}</td>
              <td>
                <span class="status-badge" [class]="user.status.toLowerCase()">{{user.status}}</span>
              </td>
              <td>{{user.lastLogin | date:'short'}}</td>
              <td>
                <button class="action-btn edit" (click)="editUser(user)">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Create User Modal -->
      <div class="modal" *ngIf="showCreateUser" (click)="closeModal($event)">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Create New User</h2>
            <button class="close-btn" (click)="showCreateUser = false">×</button>
          </div>
          <form class="user-form" (ngSubmit)="createUser()">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" [(ngModel)]="newUser.fullName" name="fullName" required>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" [(ngModel)]="newUser.email" name="email" required>
            </div>
            <div class="form-group">
              <label>Username</label>
              <input type="text" [(ngModel)]="newUser.username" name="username" required>
            </div>
            <div class="form-group">
              <label>Role</label>
              <select [(ngModel)]="newUser.role" name="role" required>
                <option value="">Select Role</option>
                <option value="RDC_STAFF">RDC Staff</option>
                <option value="LOGISTICS">Logistics</option>
                <option value="HEAD_OFFICE_MANAGER">HO Manager</option>
              </select>
            </div>
            <div class="form-group">
              <label>RDC Assignment</label>
              <select [(ngModel)]="newUser.rdc" name="rdc" required>
                <option value="">Select RDC</option>
                <option value="Colombo">Colombo RDC</option>
                <option value="Kandy">Kandy RDC</option>
                <option value="Galle">Galle RDC</option>
              </select>
            </div>
            <div class="form-group">
              <label>Temporary Password</label>
              <input type="password" [(ngModel)]="newUser.password" name="password" required>
            </div>
            <div class="form-actions">
              <button type="button" class="cancel-btn" (click)="showCreateUser = false">Cancel</button>
              <button type="submit" class="submit-btn">Create User</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Edit User Modal -->
      <div class="modal" *ngIf="showEditUser" (click)="closeModal($event)">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Edit User</h2>
            <button class="close-btn" (click)="showEditUser = false">×</button>
          </div>
          <form class="user-form" (ngSubmit)="updateUser()">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" [(ngModel)]="editingUser.fullName" name="fullName" required>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" [(ngModel)]="editingUser.email" name="email" required>
            </div>
            <div class="form-group">
              <label>Username</label>
              <input type="text" [(ngModel)]="editingUser.username" name="username" required>
            </div>
            <div class="form-group">
              <label>Role</label>
              <select [(ngModel)]="editingUser.role" name="role" required>
                <option value="RETAILER">Retailer</option>
                <option value="RDC_STAFF">RDC Staff</option>
                <option value="LOGISTICS">Logistics</option>
                <option value="HEAD_OFFICE_MANAGER">HO Manager</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="button" class="cancel-btn" (click)="showEditUser = false">Cancel</button>
              <button type="submit" class="submit-btn">Update User</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ho-users {
      padding: 2rem;
      background: #f8fafc;
      min-height: 100vh;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .create-btn {
      background: #10b981;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
    }

    .user-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      color: #3b82f6;
      margin-top: 0.5rem;
    }

    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .filter-select, .search-input {
      padding: 0.5rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      background: white;
    }

    .search-input {
      flex: 1;
      max-width: 300px;
    }

    .users-table {
      background: white;
      border-radius: 10px;
      padding: 1.5rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }

    th {
      background: #f9fafb;
      font-weight: 600;
    }

    .role-badge, .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .role-badge.rdc_staff { background: #dbeafe; color: #1e40af; }
    .role-badge.logistics { background: #fef3c7; color: #92400e; }
    .role-badge.head_office_manager { background: #f3e8ff; color: #7c3aed; }

    .status-badge.active { background: #dcfce7; color: #166534; }
    .status-badge.inactive { background: #fee2e2; color: #991b1b; }

    .action-btn {
      padding: 0.25rem 0.75rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 0.5rem;
      font-size: 0.8rem;
    }

    .action-btn.edit { background: #3b82f6; color: white; }
    .action-btn.reset { background: #f59e0b; color: white; }
    .action-btn.activate { background: #10b981; color: white; }
    .action-btn.deactivate { background: #ef4444; color: white; }

    .activity-logs {
      background: white;
      border-radius: 10px;
      padding: 1.5rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .log-list {
      max-height: 400px;
      overflow-y: auto;
    }

    .log-item {
      display: flex;
      align-items: flex-start;
      padding: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .log-icon {
      font-size: 1.5rem;
      margin-right: 1rem;
    }

    .log-message {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .log-details {
      color: #6b7280;
      font-size: 0.9rem;
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 10px;
      padding: 2rem;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
    }

    .user-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    .form-group input, .form-group select {
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 1rem;
    }

    .cancel-btn {
      background: #6b7280;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
    }

    .submit-btn {
      background: #10b981;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
    }
  `]
})
export class HoUsersComponent implements OnInit {
  showCreateUser = false;
  showEditUser = false;
  selectedRole = '';
  selectedRdc = '';
  searchTerm = '';

  totalUsers = 0;
  activeUsers = 0;
  rdcStaffCount = 0;
  logisticsCount = 0;

  users: any[] = [];
  editingUser: any = {};

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  activityLogs: any[] = [];

  newUser = {
    fullName: '',
    email: '',
    username: '',
    role: '',
    rdc: '',
    password: ''
  };

  get filteredUsers() {
    return this.users.filter(user => {
      const matchesRole = !this.selectedRole || user.role === this.selectedRole;
      const matchesRdc = !this.selectedRdc || user.rdc === this.selectedRdc;
      const matchesSearch = !this.searchTerm || 
        user.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesRole && matchesRdc && matchesSearch;
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    console.log('Loading users from API...');
    this.http.get<any[]>(`${environment.apiUrl}/admin/users`).subscribe({
      next: (users) => {
        console.log('Users received:', users);
        this.users = users.map(user => ({
          ...user,
          status: user.enabled ? 'Active' : 'Inactive',
          lastLogin: user.lastLogin ? new Date(user.lastLogin) : null,
          rdc: 'N/A' // Default since not in backend
        }));
        console.log('Users after mapping:', this.users);
        this.updateStats();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  updateStats(): void {
    this.totalUsers = this.users.length;
    this.activeUsers = this.users.filter(u => u.status === 'Active').length;
    this.rdcStaffCount = this.users.filter(u => u.role === 'RDC_STAFF').length;
    this.logisticsCount = this.users.filter(u => u.role === 'LOGISTICS').length;
    console.log('Stats updated:', { total: this.totalUsers, active: this.activeUsers, rdc: this.rdcStaffCount, logistics: this.logisticsCount });
  }

  editUser(user: any): void {
    this.editingUser = { ...user };
    this.showEditUser = true;
  }

  updateUser(): void {
    this.http.put(`${environment.apiUrl}/admin/users/${this.editingUser.id}`, this.editingUser).subscribe({
      next: () => {
        Swal.fire('Success', 'User updated successfully', 'success');
        this.showEditUser = false;
        this.loadUsers();
      },
      error: () => {
        Swal.fire('Error', 'Failed to update user', 'error');
      }
    });
  }

  createUser(): void {
    const userData = {
      fullName: this.newUser.fullName,
      email: this.newUser.email,
      username: this.newUser.username,
      password: this.newUser.password,
      role: this.newUser.role
    };

    this.http.post(`${environment.apiUrl}/auth/register`, userData, { responseType: 'text' }).subscribe({
      next: (response) => {
        console.log('Registration response:', response);
        Swal.fire('Success', 'User created successfully', 'success');
        this.showCreateUser = false;
        this.newUser = { fullName: '', email: '', username: '', role: '', rdc: '', password: '' };
        this.loadUsers();
      },
      error: (error) => {
        console.error('Registration error:', error);
        Swal.fire('Error', 'Failed to create user', 'error');
      }
    });
  }

  closeModal(event: any): void {
    if (event.target.classList.contains('modal')) {
      this.showCreateUser = false;
    }
  }


}