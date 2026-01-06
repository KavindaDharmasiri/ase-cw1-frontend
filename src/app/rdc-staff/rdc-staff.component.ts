import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rdc-staff',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h1>🏢 RDC Staff Dashboard</h1>
      <div class="cards">
        <div class="card">
          <h3>Warehouse</h3>
          <p>Manage warehouse operations</p>
        </div>
        <div class="card">
          <h3>Distribution</h3>
          <p>Track distributions</p>
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
export class RdcStaffComponent {}