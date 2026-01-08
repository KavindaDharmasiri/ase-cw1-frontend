import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../../core/services/vehicle.service';
import { Vehicle } from '../../models/vehicle.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vehicle-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="vehicle-management">
      <div class="header">
        <h1>🚛 Vehicle Management</h1>
        <button class="btn btn-primary" (click)="openAddModal()">Add Vehicle</button>
      </div>

      <div class="vehicles-grid">
        <div *ngIf="vehicles.length === 0" class="empty-state">
          <div class="empty-icon">🚛</div>
          <h3>No Vehicles Found</h3>
          <p>Add vehicles to manage logistics and deliveries.</p>
        </div>
        <div *ngFor="let vehicle of vehicles" class="vehicle-card" [class.inactive]="!vehicle.active">
          <div class="vehicle-header">
            <h3>{{vehicle.vehicleNumber}}</h3>
            <span *ngIf="!vehicle.active" class="status-badge">Inactive</span>
          </div>
          <div class="vehicle-details">
            <p><strong>Type:</strong> {{vehicle.vehicleType}}</p>
            <p><strong>Capacity:</strong> {{vehicle.capacity}} kg</p>
            <p><strong>RDC:</strong> {{vehicle.rdc?.name || 'Not assigned'}}</p>
          </div>
          <div class="vehicle-actions">
            <button class="btn btn-sm btn-edit" (click)="editVehicle(vehicle)">Edit</button>
            <button *ngIf="vehicle.active" class="btn btn-sm btn-danger" (click)="deactivateVehicle(vehicle.id!)">Deactivate</button>
            <button *ngIf="!vehicle.active" class="btn btn-sm btn-success" (click)="activateVehicle(vehicle.id!)">Activate</button>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <h2>{{isEditing ? 'Edit' : 'Add'}} Vehicle</h2>
          <form (ngSubmit)="saveVehicle()">
            <label>Vehicle Number *</label>
            <input type="text" [(ngModel)]="currentVehicle.vehicleNumber" name="number" required>
            
            <label>Vehicle Type *</label>
            <select [(ngModel)]="currentVehicle.vehicleType" name="type" required>
              <option value="">Select Type</option>
              <option value="Truck">Truck</option>
              <option value="Van">Van</option>
              <option value="Lorry">Lorry</option>
              <option value="Three Wheeler">Three Wheeler</option>
            </select>
            
            <label>Capacity (kg) *</label>
            <input type="number" [(ngModel)]="currentVehicle.capacity" name="capacity" required>
            
            <div class="modal-actions">
              <button type="button" class="btn" (click)="closeModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .vehicle-management { padding: 20px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .vehicles-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
    .vehicle-card { border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: white; }
    .inactive { opacity: 0.6; border: 2px dashed #ccc; }
    .vehicle-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .vehicle-header h3 { margin: 0; }
    .status-badge { background: #ffc107; color: #212529; padding: 2px 8px; border-radius: 12px; font-size: 12px; }
    .vehicle-details p { margin: 4px 0; }
    .vehicle-actions { display: flex; gap: 8px; margin-top: 12px; }
    .btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-primary { background: #007bff; color: white; }
    .btn-edit { background: #28a745; color: white; }
    .btn-danger { background: #dc3545; color: white; }
    .btn-success { background: #17a2b8; color: white; }
    .btn-sm { padding: 4px 8px; font-size: 12px; }
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal { background: white; padding: 24px; border-radius: 8px; width: 400px; max-width: 90vw; }
    .modal h2 { margin: 0 0 16px 0; }
    .modal input, .modal select { width: 100%; padding: 8px; margin-bottom: 12px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
    .modal label { display: block; font-weight: 600; margin-bottom: 4px; margin-top: 8px; color: #495057; font-size: 14px; }
    .modal-actions { display: flex; gap: 8px; justify-content: flex-end; }
    .empty-state { text-align: center; padding: 60px 20px; color: #666; grid-column: 1 / -1; }
    .empty-icon { font-size: 4rem; margin-bottom: 1rem; }
    .empty-state h3 { margin: 0 0 0.5rem 0; color: #333; }
    .empty-state p { margin: 0; }
  `]
})
export class VehicleManagementComponent implements OnInit {
  vehicles: Vehicle[] = [];
  showModal = false;
  isEditing = false;
  currentVehicle: Vehicle = { vehicleNumber: '', vehicleType: '', capacity: 0, rdc: null, active: true };

  constructor(private vehicleService: VehicleService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadVehicles();
  }

  loadVehicles() {
    this.vehicleService.getAllVehicles().subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error loading vehicles:', error)
    });
  }

  openAddModal() {
    this.isEditing = false;
    this.currentVehicle = { vehicleNumber: '', vehicleType: '', capacity: 0, rdc: null, active: true };
    this.showModal = true;
  }

  editVehicle(vehicle: Vehicle) {
    this.isEditing = true;
    this.currentVehicle = { ...vehicle };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveVehicle() {
    if (this.isEditing) {
      this.vehicleService.updateVehicle(this.currentVehicle.id!, this.currentVehicle).subscribe({
        next: () => {
          this.closeModal();
          this.loadVehicles();
          Swal.fire('Success', 'Vehicle updated successfully', 'success');
        },
        error: () => Swal.fire('Error', 'Failed to update vehicle', 'error')
      });
    } else {
      this.vehicleService.createVehicle(this.currentVehicle).subscribe({
        next: () => {
          this.closeModal();
          this.loadVehicles();
          Swal.fire('Success', 'Vehicle created successfully', 'success');
        },
        error: () => Swal.fire('Error', 'Failed to create vehicle', 'error')
      });
    }
  }

  deactivateVehicle(id: number) {
    this.vehicleService.deleteVehicle(id).subscribe({
      next: () => {
        this.loadVehicles();
        Swal.fire('Success', 'Vehicle deactivated', 'success');
      },
      error: () => Swal.fire('Error', 'Failed to deactivate vehicle', 'error')
    });
  }

  activateVehicle(id: number) {
    const vehicle = this.vehicles.find(v => v.id === id);
    if (vehicle) {
      vehicle.active = true;
      this.vehicleService.updateVehicle(id, vehicle).subscribe({
        next: () => {
          this.loadVehicles();
          Swal.fire('Success', 'Vehicle activated', 'success');
        },
        error: () => Swal.fire('Error', 'Failed to activate vehicle', 'error')
      });
    }
  }
}