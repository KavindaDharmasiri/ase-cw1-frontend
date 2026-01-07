import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeliveryZoneService } from '../../core/services/delivery-zone.service';
import { DeliveryZone } from '../../models/delivery-zone.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-delivery-zone-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="zone-management">
      <div class="header">
        <h1>🚚 Delivery Zone Management</h1>
        <button class="btn btn-primary" (click)="openAddModal()">Add Delivery Zone</button>
      </div>

      <div class="zones-grid">        
        <div *ngIf="zones.length === 0" class="empty-state">
          <div class="empty-icon">🚚</div>
          <h3>No Delivery Zones Found</h3>
          <p>Create delivery zones to manage shipping areas and pricing.</p>
        </div>
        <div *ngFor="let zone of zones" class="zone-card">
          <div class="zone-image">
            <img src="assets/lokaly-delivery.svg" alt="Delivery Zone" class="zone-img">
          </div>
          <div class="zone-header">
            <h3>{{zone.name}}</h3>
            <span *ngIf="!zone.active" class="status-badge">Inactive</span>
          </div>
          <div class="zone-details">
            <p><strong>Fee:</strong> LKR {{zone.deliveryFee}}</p>
            <p><strong>Days:</strong> {{zone.estimatedDeliveryDays}}</p>
            <p><strong>Description:</strong> {{zone.description || 'No description'}}</p>
          </div>
          <div class="zone-actions">
            <button class="btn btn-sm" (click)="editZone(zone)">Edit</button>
            <button *ngIf="zone.active" class="btn btn-sm btn-danger" (click)="deactivateZone(zone)">Deactivate</button>
            <button *ngIf="!zone.active" class="btn btn-sm btn-success" (click)="activateZone(zone)">Activate</button>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <h2>{{isEditing ? 'Edit' : 'Add'}} Delivery Zone</h2>
          <form (ngSubmit)="saveZone()">
            <label>Zone Name *</label>
            <input type="text" placeholder="Enter zone name" [(ngModel)]="currentZone.name" name="name" required>
            
            <label>Description</label>
            <textarea placeholder="Enter zone description" [(ngModel)]="currentZone.description" name="description"></textarea>
            
            <label>Delivery Fee (LKR) *</label>
            <input type="number" placeholder="Enter delivery fee" [(ngModel)]="currentZone.deliveryFee" name="fee" step="0.01" required>
            
            <label>Estimated Delivery Days *</label>
            <input type="number" placeholder="Enter delivery days" [(ngModel)]="currentZone.estimatedDeliveryDays" name="days" required>
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
    .zone-management { padding: 20px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .zones-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
    .empty-state { text-align: center; padding: 60px 20px; color: #666; grid-column: 1 / -1; }
    .empty-icon { font-size: 4rem; margin-bottom: 1rem; }
    .empty-state h3 { margin: 0 0 0.5rem 0; color: #333; }
    .empty-state p { margin: 0; }
    .zone-card { border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: white; }
    .zone-image { margin-bottom: 16px; text-align: center; }
    .zone-img { width: 80px; height: 80px; object-fit: contain; }
    .zone-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .zone-header h3 { margin: 0; }
    .status-badge { background: #ffc107; color: #212529; padding: 2px 8px; border-radius: 12px; font-size: 12px; }
    .zone-details p { margin: 4px 0; }
    .zone-actions { display: flex; gap: 8px; margin-top: 12px; }
    .btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-primary { background: #007bff; color: white; }
    .btn-danger { background: #dc3545; color: white; }
    .btn-success { background: #28a745; color: white; }
    .btn-sm { padding: 4px 8px; font-size: 12px; }
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal { background: white; padding: 24px; border-radius: 8px; width: 400px; max-width: 90vw; }
    .modal h2 { margin: 0 0 16px 0; }
    .modal input, .modal textarea { width: 100%; padding: 8px; margin-bottom: 12px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
    .modal label { display: block; font-weight: 600; margin-bottom: 4px; margin-top: 8px; color: #495057; font-size: 14px; }
    .modal textarea { height: 80px; resize: vertical; }
    .modal-actions { display: flex; gap: 8px; justify-content: flex-end; }
  `]
})
export class DeliveryZoneManagementComponent implements OnInit {
  zones: DeliveryZone[] = [];
  showModal = false;
  isEditing = false;
  currentZone: DeliveryZone = { name: '', deliveryFee: 0, estimatedDeliveryDays: 1, active: true };

  constructor(private deliveryZoneService: DeliveryZoneService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadZones();
  }

  loadZones() {
    console.log('Loading delivery zones...');
    this.deliveryZoneService.getAllDeliveryZones().subscribe({
      next: (zones) => {
        console.log('Zones loaded:', zones);
        this.zones = zones;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error loading zones:', error)
    });
  }

  openAddModal() {
    this.isEditing = false;
    this.currentZone = { name: '', deliveryFee: 0, estimatedDeliveryDays: 1, active: true };
    this.showModal = true;
  }

  editZone(zone: DeliveryZone) {
    this.isEditing = true;
    this.currentZone = { ...zone };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveZone() {
    if (this.isEditing) {
      this.deliveryZoneService.updateDeliveryZone(this.currentZone.id!, this.currentZone).subscribe({
        next: () => {
          this.closeModal();
          this.loadZones();
          Swal.fire('Success', 'Zone updated successfully', 'success');
        },
        error: () => Swal.fire('Error', 'Failed to update zone', 'error')
      });
    } else {
      this.deliveryZoneService.createDeliveryZone(this.currentZone).subscribe({
        next: () => {
          this.closeModal();
          this.loadZones();
          Swal.fire('Success', 'Zone created successfully', 'success');
        },
        error: () => Swal.fire('Error', 'Failed to create zone', 'error')
      });
    }
  }

  activateZone(zone: DeliveryZone) {
    this.deliveryZoneService.activateDeliveryZone(zone.id!).subscribe({
      next: () => {
        this.loadZones();
        Swal.fire('Success', 'Zone activated', 'success');
      },
      error: () => Swal.fire('Error', 'Failed to activate zone', 'error')
    });
  }

  deactivateZone(zone: DeliveryZone) {
    this.deliveryZoneService.deactivateDeliveryZone(zone.id!).subscribe({
      next: () => {
        this.loadZones();
        Swal.fire('Success', 'Zone deactivated', 'success');
      },
      error: () => Swal.fire('Error', 'Failed to deactivate zone', 'error')
    });
  }
}