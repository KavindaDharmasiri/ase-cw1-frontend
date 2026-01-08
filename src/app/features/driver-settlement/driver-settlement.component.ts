import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface DriverSettlement {
  id?: number;
  driverId: number;
  driverName: string;
  settlementDate: string;
  totalCash: number;
  totalCheques: number;
  status: string;
}

@Component({
  selector: 'app-driver-settlement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <h2>Driver Settlement Management</h2>
      
      <div class="row">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">
              <h5>Pending Settlements</h5>
            </div>
            <div class="card-body">
              <table class="table">
                <thead>
                  <tr>
                    <th>Driver</th>
                    <th>Date</th>
                    <th>Cash</th>
                    <th>Cheques</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let settlement of settlements">
                    <td>{{settlement.driverName}}</td>
                    <td>{{settlement.settlementDate | date}}</td>
                    <td>Rs. {{settlement.totalCash}}</td>
                    <td>Rs. {{settlement.totalCheques}}</td>
                    <td>
                      <span class="badge" [ngClass]="{
                        'bg-warning': settlement.status === 'PENDING',
                        'bg-success': settlement.status === 'COMPLETED'
                      }">
                        {{settlement.status}}
                      </span>
                    </td>
                    <td>
                      <button class="btn btn-sm btn-primary me-2" 
                              (click)="processSettlement(settlement)"
                              [disabled]="settlement.status === 'COMPLETED'">
                        Process
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div class="col-md-4">
          <div class="card">
            <div class="card-header">
              <h5>Settlement Summary</h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <strong>Total Pending Cash:</strong><br>
                Rs. {{getTotalPendingCash()}}
              </div>
              <div class="mb-3">
                <strong>Total Pending Cheques:</strong><br>
                Rs. {{getTotalPendingCheques()}}
              </div>
              <div class="mb-3">
                <strong>Settlements Today:</strong><br>
                {{getTodaySettlements()}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DriverSettlementComponent implements OnInit {
  settlements: DriverSettlement[] = [];

  ngOnInit() {
    this.loadSettlements();
  }

  loadSettlements() {
    this.settlements = [
      {
        id: 1,
        driverId: 1,
        driverName: 'John Doe',
        settlementDate: '2024-01-15',
        totalCash: 15000,
        totalCheques: 25000,
        status: 'PENDING'
      }
    ];
  }

  processSettlement(settlement: DriverSettlement) {
    if (confirm(`Process settlement for ${settlement.driverName}?`)) {
      settlement.status = 'COMPLETED';
    }
  }

  getTotalPendingCash(): number {
    return this.settlements
      .filter(s => s.status === 'PENDING')
      .reduce((sum, s) => sum + s.totalCash, 0);
  }

  getTotalPendingCheques(): number {
    return this.settlements
      .filter(s => s.status === 'PENDING')
      .reduce((sum, s) => sum + s.totalCheques, 0);
  }

  getTodaySettlements(): number {
    const today = new Date().toISOString().split('T')[0];
    return this.settlements.filter(s => s.settlementDate === today).length;
  }
}