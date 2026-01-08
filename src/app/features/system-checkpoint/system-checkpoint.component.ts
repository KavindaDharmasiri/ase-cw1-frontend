import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-system-checkpoint',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="checkpoint-container">
      <h2>System Checkpoint Verification</h2>
      
      <div class="checkpoint-grid">
        <div class="checkpoint-card" [class.success]="checks.products" [class.pending]="!checks.products">
          <div class="check-icon">{{checks.products ? '✅' : '⏳'}}</div>
          <div class="check-content">
            <h3>Products Exist</h3>
            <p>{{productCount}} products in system</p>
          </div>
        </div>
        
        <div class="checkpoint-card" [class.success]="checks.customers" [class.pending]="!checks.customers">
          <div class="check-icon">{{checks.customers ? '✅' : '⏳'}}</div>
          <div class="check-content">
            <h3>Customers Exist</h3>
            <p>{{customerCount}} customers registered</p>
          </div>
        </div>
        
        <div class="checkpoint-card" [class.success]="checks.rdcs" [class.pending]="!checks.rdcs">
          <div class="check-icon">{{checks.rdcs ? '✅' : '⏳'}}</div>
          <div class="check-content">
            <h3>RDCs Exist</h3>
            <p>{{rdcCount}} RDCs configured</p>
          </div>
        </div>
        
        <div class="checkpoint-card" [class.success]="checks.users" [class.pending]="!checks.users">
          <div class="check-icon">{{checks.users ? '✅' : '⏳'}}</div>
          <div class="check-content">
            <h3>Users & Roles Active</h3>
            <p>{{userCount}} active users with permissions</p>
          </div>
        </div>
        
        <div class="checkpoint-card" [class.success]="checks.noStock" [class.pending]="!checks.noStock">
          <div class="check-icon">{{checks.noStock ? '✅' : '⏳'}}</div>
          <div class="check-content">
            <h3>No Stock in Warehouse</h3>
            <p>Warehouse empty (as expected)</p>
          </div>
        </div>
        
        <div class="checkpoint-card" [class.success]="checks.noOrders" [class.pending]="!checks.noOrders">
          <div class="check-icon">{{checks.noOrders ? '✅' : '⏳'}}</div>
          <div class="check-content">
            <h3>No Orders Possible</h3>
            <p>Order system ready but no stock</p>
          </div>
        </div>
      </div>
      
      <div class="summary">
        <h3>System Status: {{allChecksPass ? 'READY FOR PROCUREMENT' : 'SETUP IN PROGRESS'}}</h3>
        <p>{{passedChecks}}/{{totalChecks}} checks passed</p>
        <div class="next-steps" *ngIf="allChecksPass">
          <h4>Next Steps:</h4>
          <ul>
            <li>Proceed to Procurement Phase</li>
            <li>Create Purchase Orders</li>
            <li>Receive Goods at Warehouse</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkpoint-container { max-width: 1200px; margin: 20px auto; padding: 20px; }
    .checkpoint-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .checkpoint-card { display: flex; align-items: center; padding: 20px; border-radius: 8px; border: 2px solid #ddd; }
    .checkpoint-card.success { border-color: #28a745; background-color: #f8fff9; }
    .checkpoint-card.pending { border-color: #ffc107; background-color: #fffdf5; }
    .check-icon { font-size: 2rem; margin-right: 15px; }
    .check-content h3 { margin: 0 0 5px 0; color: #333; }
    .check-content p { margin: 0; color: #666; }
    .summary { text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px; }
    .summary h3 { color: #333; margin-bottom: 10px; }
    .next-steps { margin-top: 15px; text-align: left; }
    .next-steps ul { margin: 10px 0; }
  `]
})
export class SystemCheckpointComponent implements OnInit {
  checks = {
    products: false,
    customers: false,
    rdcs: false,
    users: false,
    noStock: false,
    noOrders: false
  };

  productCount = 0;
  customerCount = 0;
  rdcCount = 0;
  userCount = 0;

  ngOnInit() {
    this.runCheckpoint();
  }

  runCheckpoint() {
    // Mock verification - replace with actual API calls
    this.productCount = 25;
    this.customerCount = 12;
    this.rdcCount = 5;
    this.userCount = 18;

    this.checks.products = this.productCount > 0;
    this.checks.customers = this.customerCount > 0;
    this.checks.rdcs = this.rdcCount > 0;
    this.checks.users = this.userCount > 0;
    this.checks.noStock = true; // No stock initially
    this.checks.noOrders = true; // No orders possible without stock
  }

  get allChecksPass(): boolean {
    return Object.values(this.checks).every(check => check);
  }

  get passedChecks(): number {
    return Object.values(this.checks).filter(check => check).length;
  }

  get totalChecks(): number {
    return Object.keys(this.checks).length;
  }
}