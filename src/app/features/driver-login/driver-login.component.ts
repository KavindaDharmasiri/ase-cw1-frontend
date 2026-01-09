import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-driver-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="driver-login">
      <div class="login-card">
        <h2>🚛 Driver Login</h2>
        <form (ngSubmit)="login()">
          <div class="form-group">
            <label>Driver Name</label>
            <select [(ngModel)]="selectedDriver" name="driver" required>
              <option value="">Select Driver</option>
              <option *ngFor="let driver of drivers" [value]="driver.name">{{driver.name}}</option>
            </select>
          </div>
          <button type="submit" [disabled]="!selectedDriver">Access Deliveries</button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .driver-login { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f5f5f5; }
    .login-card { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 400px; }
    .form-group { margin-bottom: 20px; }
    label { display: block; margin-bottom: 5px; font-weight: 600; }
    select { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; }
    button { width: 100%; padding: 12px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:disabled { background: #ccc; cursor: not-allowed; }
  `]
})
export class DriverLoginComponent {
  selectedDriver = '';
  drivers: any[] = [];

  constructor(private router: Router, private http: HttpClient) {
    this.loadDrivers();
  }

  loadDrivers() {
    this.http.get<any[]>(`${environment.apiUrl}/drivers`).subscribe({
      next: (drivers) => this.drivers = drivers,
      error: () => this.drivers = []
    });
  }

  login() {
    if (!this.selectedDriver) return;
    
    localStorage.setItem('currentDriver', this.selectedDriver);
    this.router.navigate(['/driver-deliveries']);
  }
}