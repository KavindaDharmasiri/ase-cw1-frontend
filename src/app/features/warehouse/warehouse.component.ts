import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WarehouseService } from '../../core/services/warehouse.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-warehouse',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="warehouse">
      <div class="header">
        <h1>📋 Pick Lists & Warehouse Operations</h1>
        <button class="btn btn-primary" (click)="openAddModal()">Create Pick List</button>
      </div>

      <div class="filters">
        <select [(ngModel)]="selectedStatus" (change)="filterByStatus()">
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="PICKING">Picking</option>
          <option value="PICKED">Picked</option>
          <option value="LOADING">Loading</option>
          <option value="LOADED">Loaded</option>
          <option value="DISPATCHED">Dispatched</option>
        </select>
      </div>

      <div class="picklist-grid">
        <div *ngIf="pickLists.length === 0" class="empty-state">
          <div class="empty-icon">📋</div>
          <h3>No Pick Lists Found</h3>
          <p>Create pick lists to organize warehouse operations and deliveries.</p>
        </div>
        <div *ngFor="let pickList of pickLists" class="picklist-card">
          <div class="picklist-header">
            <h3>{{pickList.pickListNumber}}</h3>
            <span class="status-badge" [class]="'status-' + pickList.status.toLowerCase()">{{pickList.status}}</span>
          </div>
          <div class="picklist-details">
            <p><strong>RDC:</strong> {{pickList.rdc?.name || 'N/A'}}</p>
            <p><strong>Vehicle:</strong> {{pickList.vehicle?.vehicleNumber || 'Not assigned'}}</p>
            <p><strong>Driver:</strong> {{pickList.driver?.name || 'Not assigned'}}</p>
            <p><strong>Items:</strong> {{pickList.items?.length || 0}}</p>
            <p><strong>Created:</strong> {{pickList.createdDate | date:'short'}}</p>
          </div>
          <div class="picklist-actions">
            <button class="btn btn-sm btn-info" (click)="viewPickList(pickList)">View</button>
            <button *ngIf="pickList.status === 'PENDING'" class="btn btn-sm btn-primary" (click)="updateStatus(pickList.id, 'PICKING')">Start Picking</button>
            <button *ngIf="pickList.status === 'PICKING'" class="btn btn-sm btn-success" (click)="updateStatus(pickList.id, 'PICKED')">Mark Picked</button>
            <button *ngIf="pickList.status === 'PICKED'" class="btn btn-sm btn-warning" (click)="updateStatus(pickList.id, 'LOADING')">Start Loading</button>
            <button *ngIf="pickList.status === 'LOADING'" class="btn btn-sm btn-info" (click)="updateStatus(pickList.id, 'LOADED')">Mark Loaded</button>
            <button *ngIf="pickList.status === 'LOADED'" class="btn btn-sm btn-danger" (click)="updateStatus(pickList.id, 'DISPATCHED')">Dispatch</button>
          </div>
        </div>
      </div>

      <!-- Add Pick List Modal -->
      <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <h2>Create Pick List</h2>
          <form (ngSubmit)="savePickList()">
            <label>RDC *</label>
            <select [(ngModel)]="currentPickList.rdc" name="rdc" required>
              <option value="">Select RDC</option>
              <option *ngFor="let rdc of rdcs" [ngValue]="rdc">{{rdc.name}}</option>
            </select>
            
            <label>Vehicle</label>
            <select [(ngModel)]="currentPickList.vehicle" name="vehicle">
              <option value="">Select Vehicle</option>
              <option *ngFor="let vehicle of vehicles" [ngValue]="vehicle">{{vehicle.vehicleNumber}}</option>
            </select>
            
            <label>Driver</label>
            <select [(ngModel)]="currentPickList.driver" name="driver">
              <option value="">Select Driver</option>
              <option *ngFor="let driver of drivers" [ngValue]="driver">{{driver.name}}</option>
            </select>
            
            <label>Remarks</label>
            <textarea [(ngModel)]="currentPickList.remarks" name="remarks" placeholder="Any special instructions"></textarea>
            
            <div class="modal-actions">
              <button type="button" class="btn" (click)="closeModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">Create</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .warehouse { padding: 20px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .filters { margin-bottom: 20px; }
    .filters select { padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
    .picklist-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px; }
    .picklist-card { border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: white; }
    .picklist-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .picklist-header h3 { margin: 0; }
    .status-badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .status-pending { background: #ffc107; color: #212529; }
    .status-picking { background: #17a2b8; color: white; }
    .status-picked { background: #28a745; color: white; }
    .status-loading { background: #fd7e14; color: white; }
    .status-loaded { background: #6f42c1; color: white; }
    .status-dispatched { background: #dc3545; color: white; }
    .picklist-details p { margin: 4px 0; }
    .picklist-actions { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
    .btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-primary { background: #007bff; color: white; }
    .btn-success { background: #28a745; color: white; }
    .btn-info { background: #17a2b8; color: white; }
    .btn-warning { background: #ffc107; color: #212529; }
    .btn-danger { background: #dc3545; color: white; }
    .btn-sm { padding: 4px 8px; font-size: 12px; }
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal { background: white; padding: 24px; border-radius: 8px; width: 500px; max-width: 90vw; }
    .modal h2 { margin: 0 0 16px 0; }
    .modal input, .modal select, .modal textarea { width: 100%; padding: 8px; margin-bottom: 12px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
    .modal label { display: block; font-weight: 600; margin-bottom: 4px; margin-top: 8px; color: #495057; font-size: 14px; }
    .modal textarea { height: 80px; resize: vertical; }
    .modal-actions { display: flex; gap: 8px; justify-content: flex-end; }
    .empty-state { text-align: center; padding: 60px 20px; color: #666; grid-column: 1 / -1; }
    .empty-icon { font-size: 4rem; margin-bottom: 1rem; }
    .empty-state h3 { margin: 0 0 0.5rem 0; color: #333; }
    .empty-state p { margin: 0; }
  `]
})
export class WarehouseComponent implements OnInit {
  pickLists: any[] = [];
  rdcs: any[] = [];
  vehicles: any[] = [];
  drivers: any[] = [];
  showModal = false;
  selectedStatus = '';
  currentPickList: any = { rdc: null, vehicle: null, driver: null, remarks: '' };

  constructor(private warehouseService: WarehouseService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadPickLists();
    this.loadRDCs();
    this.loadVehicles();
    this.loadDrivers();
  }

  loadPickLists() {
    this.warehouseService.getAllPickLists().subscribe({
      next: (pickLists) => {
        this.pickLists = pickLists;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error loading pick lists:', error)
    });
  }

  loadRDCs() {
    this.rdcs = []; // Placeholder
  }

  loadVehicles() {
    this.vehicles = []; // Placeholder
  }

  loadDrivers() {
    this.drivers = []; // Placeholder
  }

  filterByStatus() {
    if (this.selectedStatus) {
      this.warehouseService.getPickListsByStatus(this.selectedStatus).subscribe({
        next: (pickLists) => this.pickLists = pickLists,
        error: (error) => console.error('Error filtering pick lists:', error)
      });
    } else {
      this.loadPickLists();
    }
  }

  openAddModal() {
    this.currentPickList = { rdc: null, vehicle: null, driver: null, remarks: '' };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  savePickList() {
    this.warehouseService.createPickList(this.currentPickList).subscribe({
      next: () => {
        this.closeModal();
        this.loadPickLists();
        Swal.fire('Success', 'Pick list created successfully', 'success');
      },
      error: () => Swal.fire('Error', 'Failed to create pick list', 'error')
    });
  }

  updateStatus(id: number, status: string) {
    this.warehouseService.updatePickListStatus(id, status).subscribe({
      next: () => {
        this.loadPickLists();
        Swal.fire('Success', 'Status updated successfully', 'success');
      },
      error: () => Swal.fire('Error', 'Failed to update status', 'error')
    });
  }

  viewPickList(pickList: any) {
    Swal.fire({
      title: pickList.pickListNumber,
      html: `
        <p><strong>Status:</strong> ${pickList.status}</p>
        <p><strong>RDC:</strong> ${pickList.rdc?.name || 'N/A'}</p>
        <p><strong>Vehicle:</strong> ${pickList.vehicle?.vehicleNumber || 'Not assigned'}</p>
        <p><strong>Driver:</strong> ${pickList.driver?.name || 'Not assigned'}</p>
        <p><strong>Items:</strong> ${pickList.items?.length || 0}</p>
        <p><strong>Created:</strong> ${new Date(pickList.createdDate).toLocaleDateString()}</p>
        <p><strong>Remarks:</strong> ${pickList.remarks || 'None'}</p>
      `,
      icon: 'info',
      width: 600
    });
  }
}