import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-retailer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h1>🏪 Retailer Dashboard</h1>
      <div class="cards">
        <div class="card">
          <h3>Orders</h3>
          <p>Manage your orders</p>
        </div>
        <div class="card">
          <h3>Inventory</h3>
          <p>Check stock levels</p>
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
export class RetailerComponent {}