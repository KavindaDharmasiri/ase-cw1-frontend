import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-head-office',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h1>👔 Head Office Manager Dashboard</h1>
      <div class="cards">
        <div class="card">
          <h3>Analytics</h3>
          <p>View business analytics</p>
        </div>
        <div class="card">
          <h3>Reports</h3>
          <p>Generate reports</p>
        </div>
        <div class="card">
          <h3>Users</h3>
          <p>Manage system users</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { padding: 20px; }
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
    .card { padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
  `]
})
export class HeadOfficeComponent {}