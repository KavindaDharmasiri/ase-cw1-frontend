import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeliveryService } from '../../core/services/delivery.service';
import { AuthService } from '../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-delivery-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DeliveryService],
  template: `
    <div class="delivery-container">
      <h1>🚚 Delivery Tracking</h1>
      
      <div class="filters">
        <select [(ngModel)]="statusFilter" (change)="filterDeliveries()">
          <option value="">All Status</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="IN_TRANSIT">In Transit</option>
          <option value="DELIVERED">Delivered</option>
          <option value="FAILED">Failed</option>
        </select>
        
        <div class="stats">
          <span class="stat">Total: {{deliveries.length}}</span>
          <span class="stat">In Transit: {{getInTransitCount()}}</span>
          <span class="stat">Delivered Today: {{getDeliveredTodayCount()}}</span>
        </div>
      </div>

      <div class="deliveries-grid">
        <div *ngFor="let delivery of filteredDeliveries" class="delivery-card" 
             [ngClass]="'status-' + delivery.status.toLowerCase()">
          <div class="delivery-header">
            <h3>Delivery #{{delivery.id}}</h3>
            <span class="status-badge">{{delivery.status}}</span>
          </div>
          
          <div class="delivery-details">
            <p><strong>Order:</strong> #{{delivery.order.id}}</p>
            <p><strong>Customer:</strong> {{delivery.order.customer.fullName}}</p>
            <p><strong>Driver:</strong> {{delivery.driverName}}</p>
            <p><strong>Vehicle:</strong> {{delivery.vehicleNumber}}</p>
            <p><strong>Scheduled:</strong> {{formatDate(delivery.scheduledDate)}}</p>
            <p><strong>Address:</strong> {{delivery.order.deliveryAddress}}</p>
            <p *ngIf="delivery.currentLocation"><strong>Location:</strong> {{delivery.currentLocation}}</p>
          </div>

          <div class="delivery-actions" *ngIf="userRole === 'LOGISTICS'">
            <select [(ngModel)]="delivery.newStatus" class="status-select">
              <option value="SCHEDULED">Scheduled</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="DELIVERED">Delivered</option>
              <option value="FAILED">Failed</option>
            </select>
            <input type="text" [(ngModel)]="delivery.newLocation" placeholder="Current Location" class="location-input">
            <button (click)="updateDeliveryStatus(delivery)" 
                    [disabled]="delivery.newStatus === delivery.status">
              Update
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="filteredDeliveries.length === 0" class="no-deliveries">
        <p>No deliveries found.</p>
      </div>
    </div>
  `,
  styles: [`
    .delivery-container { padding: 20px; }
    .filters { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; }
    .filters select { padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
    .stats { display: flex; gap: 20px; }
    .stat { padding: 8px 12px; background: white; border-radius: 4px; font-weight: bold; }
    .deliveries-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 20px; }
    .delivery-card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; background: white; }
    .delivery-card.status-scheduled { border-left: 4px solid #f39c12; }
    .delivery-card.status-in_transit { border-left: 4px solid #3498db; }
    .delivery-card.status-delivered { border-left: 4px solid #27ae60; }
    .delivery-card.status-failed { border-left: 4px solid #e74c3c; }
    .delivery-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
    .delivery-header h3 { margin: 0; }
    .status-badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase; background: #ecf0f1; color: #2c3e50; }
    .delivery-details p { margin: 5px 0; }
    .delivery-actions { display: flex; gap: 10px; align-items: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee; }
    .status-select, .location-input { padding: 6px; border: 1px solid #ddd; border-radius: 4px; }
    .location-input { flex: 1; }
    .delivery-actions button { padding: 8px 16px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .delivery-actions button:disabled { background: #bdc3c7; cursor: not-allowed; }
    .no-deliveries { text-align: center; padding: 40px; color: #666; }
  `]
})
export class DeliveryTrackingComponent implements OnInit {
  deliveries: any[] = [];
  filteredDeliveries: any[] = [];
  statusFilter = '';
  userRole = '';

  constructor(
    private deliveryService: DeliveryService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getUserRole() || '';
    this.loadDeliveries();
  }

  loadDeliveries() {
    this.deliveryService.getAllDeliveries().subscribe({
      next: (deliveries) => {
        this.deliveries = deliveries.map(delivery => ({
          ...delivery, 
          newStatus: delivery.status,
          newLocation: delivery.currentLocation || ''
        }));
        this.filteredDeliveries = [...this.deliveries];
      },
      error: (error) => console.error('Error loading deliveries:', error)
    });
  }

  filterDeliveries() {
    if (this.statusFilter) {
      this.filteredDeliveries = this.deliveries.filter(delivery => 
        delivery.status === this.statusFilter);
    } else {
      this.filteredDeliveries = [...this.deliveries];
    }
  }

  updateDeliveryStatus(delivery: any) {
    this.deliveryService.updateDeliveryStatus(delivery.id, {
      status: delivery.newStatus,
      currentLocation: delivery.newLocation,
      notes: ''
    }).subscribe({
      next: (updatedDelivery) => {
        delivery.status = delivery.newStatus;
        delivery.currentLocation = delivery.newLocation;
        Swal.fire('Success', 'Delivery status updated successfully', 'success');
      },
      error: (error) => {
        Swal.fire('Error', 'Failed to update delivery status', 'error');
        console.error('Error updating delivery status:', error);
      }
    });
  }

  getInTransitCount(): number {
    return this.deliveries.filter(d => d.status === 'IN_TRANSIT').length;
  }

  getDeliveredTodayCount(): number {
    const today = new Date().toDateString();
    return this.deliveries.filter(d => 
      d.status === 'DELIVERED' && 
      new Date(d.actualDeliveryDate).toDateString() === today
    ).length;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}