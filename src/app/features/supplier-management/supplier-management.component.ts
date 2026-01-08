import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupplierService } from '../../core/services/supplier.service';
import { Supplier } from '../../models/supplier.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-supplier-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="supplier-management">
      <div class="header">
        <h1>🏢 Supplier Management</h1>
        <button class="btn btn-primary" (click)="openAddModal()">Add Supplier</button>
      </div>

      <div class="suppliers-grid">
        <div *ngIf="suppliers.length === 0" class="empty-state">
          <div class="empty-icon">🏢</div>
          <h3>No Suppliers Found</h3>
          <p>Add suppliers to manage procurement and purchase orders.</p>
        </div>
        <div *ngFor="let supplier of suppliers" class="supplier-card" [class.inactive]="!supplier.active">
          <div class="supplier-header">
            <h3>{{supplier.name}}</h3>
            <span *ngIf="!supplier.active" class="status-badge">Inactive</span>
          </div>
          <div class="supplier-details">
            <p><strong>Contact:</strong> {{supplier.contactPerson}}</p>
            <p><strong>Email:</strong> {{supplier.email}}</p>
            <p><strong>Phone:</strong> {{supplier.phone}}</p>
            <p><strong>Address:</strong> {{supplier.address || 'No address'}}</p>
          </div>
          <div class="supplier-actions">
            <button class="btn btn-sm btn-edit" (click)="editSupplier(supplier)">Edit</button>
            <button class="btn btn-sm btn-danger" (click)="deleteSupplier(supplier.id!)">Delete</button>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <h2>{{isEditing ? 'Edit' : 'Add'}} Supplier</h2>
          <form (ngSubmit)="saveSupplier()">
            <label>Supplier Name *</label>
            <input type="text" [(ngModel)]="currentSupplier.name" name="name" required>
            
            <label>Contact Person *</label>
            <input type="text" [(ngModel)]="currentSupplier.contactPerson" name="contact" required>
            
            <label>Email *</label>
            <input type="email" [(ngModel)]="currentSupplier.email" name="email" required>
            
            <label>Phone *</label>
            <input type="text" [(ngModel)]="currentSupplier.phone" name="phone" required>
            
            <label>Address</label>
            <textarea [(ngModel)]="currentSupplier.address" name="address"></textarea>
            
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
    .supplier-management { padding: 20px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .suppliers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px; }
    .supplier-card { border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: white; }
    .inactive { opacity: 0.6; border: 2px dashed #ccc; }
    .supplier-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .supplier-header h3 { margin: 0; }
    .status-badge { background: #ffc107; color: #212529; padding: 2px 8px; border-radius: 12px; font-size: 12px; }
    .supplier-details p { margin: 4px 0; }
    .supplier-actions { display: flex; gap: 8px; margin-top: 12px; }
    .btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-primary { background: #007bff; color: white; }
    .btn-edit { background: #28a745; color: white; }
    .btn-danger { background: #dc3545; color: white; }
    .btn-sm { padding: 4px 8px; font-size: 12px; }
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal { background: white; padding: 24px; border-radius: 8px; width: 500px; max-width: 90vw; }
    .modal h2 { margin: 0 0 16px 0; }
    .modal input, .modal textarea { width: 100%; padding: 8px; margin-bottom: 12px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
    .modal label { display: block; font-weight: 600; margin-bottom: 4px; margin-top: 8px; color: #495057; font-size: 14px; }
    .modal textarea { height: 80px; resize: vertical; }
    .modal-actions { display: flex; gap: 8px; justify-content: flex-end; }
    .empty-state { text-align: center; padding: 60px 20px; color: #666; grid-column: 1 / -1; }
    .empty-icon { font-size: 4rem; margin-bottom: 1rem; }
    .empty-state h3 { margin: 0 0 0.5rem 0; color: #333; }
    .empty-state p { margin: 0; }
  `]
})
export class SupplierManagementComponent implements OnInit {
  suppliers: Supplier[] = [];
  showModal = false;
  isEditing = false;
  currentSupplier: Supplier = { name: '', contactPerson: '', email: '', phone: '', active: true };

  constructor(private supplierService: SupplierService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.supplierService.getAllSuppliers().subscribe({
      next: (suppliers) => {
        this.suppliers = suppliers;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error loading suppliers:', error)
    });
  }

  openAddModal() {
    this.isEditing = false;
    this.currentSupplier = { name: '', contactPerson: '', email: '', phone: '', active: true };
    this.showModal = true;
  }

  editSupplier(supplier: Supplier) {
    this.isEditing = true;
    this.currentSupplier = { ...supplier };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveSupplier() {
    if (this.isEditing) {
      this.supplierService.updateSupplier(this.currentSupplier.id!, this.currentSupplier).subscribe({
        next: () => {
          this.closeModal();
          this.loadSuppliers();
          Swal.fire('Success', 'Supplier updated successfully', 'success');
        },
        error: () => Swal.fire('Error', 'Failed to update supplier', 'error')
      });
    } else {
      this.supplierService.createSupplier(this.currentSupplier).subscribe({
        next: () => {
          this.closeModal();
          this.loadSuppliers();
          Swal.fire('Success', 'Supplier created successfully', 'success');
        },
        error: () => Swal.fire('Error', 'Failed to create supplier', 'error')
      });
    }
  }

  deleteSupplier(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        this.supplierService.deleteSupplier(id).subscribe({
          next: () => {
            this.loadSuppliers();
            Swal.fire('Deleted', 'Supplier deleted successfully', 'success');
          },
          error: () => Swal.fire('Error', 'Failed to delete supplier', 'error')
        });
      }
    });
  }
}