import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RDCService } from '../../core/services/rdc.service';
import { RDC } from '../../models/rdc.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rdc-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="rdc-management">
      <div class="header">
        <h1>🏢 RDC Management</h1>
        <div class="header-actions">
          <button class="btn btn-toggle" (click)="toggleView()">{{showAll ? 'Show Active Only' : 'Show All RDCs'}}</button>
          <button class="btn btn-primary" (click)="openAddModal()">+ Add New RDC</button>
        </div>
      </div>

      <div class="rdc-grid">
        <div *ngIf="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading RDCs...</p>
        </div>
        <div *ngIf="!loading && rdcs.length === 0" class="empty-state">
          <div class="empty-icon">🏢</div>
          <h3>No RDCs Found</h3>
          <p>{{showAll ? 'No Regional Distribution Centers exist yet.' : 'No active Regional Distribution Centers found.'}} Click "Add New RDC" to get started.</p>
        </div>
        <div *ngFor="let rdc of rdcs" class="rdc-card" [ngClass]="{'inactive': !rdc.active}">
          <div class="rdc-image">
            <img src="assets/rdc.jpg" alt="RDC Building" class="rdc-img">
          </div>
          <div class="rdc-info">
            <div class="rdc-header">
              <h3>{{rdc.name}} RDC</h3>
              <span *ngIf="!rdc.active" class="status-badge">Inactive</span>
            </div>
            <div class="rdc-details">
              <div class="detail-item">
                <span class="detail-icon">📍</span>
                <div class="detail-content">
                  <span class="detail-label">Location</span>
                  <span class="detail-value">{{rdc.location}}</span>
                </div>
              </div>
              <div class="detail-item" *ngIf="rdc.address">
                <span class="detail-icon">🏠</span>
                <div class="detail-content">
                  <span class="detail-label">Address</span>
                  <span class="detail-value">{{rdc.address}}</span>
                </div>
              </div>
              <div class="detail-item" *ngIf="rdc.contactNumber">
                <span class="detail-icon">📞</span>
                <div class="detail-content">
                  <span class="detail-label">Contact</span>
                  <span class="detail-value">{{rdc.contactNumber}}</span>
                </div>
              </div>
              <div class="detail-item" *ngIf="rdc.managerName">
                <span class="detail-icon">👤</span>
                <div class="detail-content">
                  <span class="detail-label">Manager</span>
                  <span class="detail-value">{{rdc.managerName}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="rdc-actions">
            <button class="btn btn-sm btn-edit" (click)="editRDC(rdc)">✏️ Edit</button>
            <button *ngIf="rdc.active" class="btn btn-sm btn-danger" (click)="deleteRDC(rdc)">🚫 Deactivate</button>
            <button *ngIf="!rdc.active" class="btn btn-sm btn-success" (click)="activateRDC(rdc)">✅ Activate</button>
          </div>
        </div>
      </div>

      <!-- Add/Edit Modal -->
      <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <h2>{{isEditing ? 'Edit' : 'Add New'}} RDC</h2>
          <form (ngSubmit)="saveRDC()">
            <input type="text" placeholder="RDC Name" [(ngModel)]="currentRDC.name" name="name" required>
            <input type="text" placeholder="Location/Province" [(ngModel)]="currentRDC.location" name="location" required>
            <input type="text" placeholder="Address" [(ngModel)]="currentRDC.address" name="address">
            <input type="text" placeholder="Contact Number" [(ngModel)]="currentRDC.contactNumber" name="contact">
            <input type="text" placeholder="Manager Name" [(ngModel)]="currentRDC.managerName" name="manager">
            <div class="modal-actions">
              <button type="button" class="btn" (click)="closeModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">{{isEditing ? 'Update' : 'Create'}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .rdc-management { padding: 60px; background: #f8fafc; min-height: 100vh; }
    .header { margin-bottom: 40px; }
    .header-actions { display: flex; gap: 16px; }
    .btn-toggle { background: #6c757d; color: white; }
    .btn-edit { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white !important; border: none; }
    .btn-edit:hover { background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%); color: white !important; }
    .btn-danger { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); color: white !important; border: none; }
    .btn-danger:hover { background: linear-gradient(135deg, #ff5252 0%, #d32f2f 100%); color: white !important; }
    .btn-success { background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%); color: white !important; border: none; }
    .btn-success:hover { background: linear-gradient(135deg, #26a69a 0%, #00695c 100%); color: white !important; }
    .inactive { opacity: 0.6; border: 2px dashed #ccc; }
    .status-badge { background: #ffc107; color: #212529; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-left: 8px; }
    .rdc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
    .rdc-card { border: 1px solid #ddd; border-radius: 12px; padding: 20px; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .rdc-image { margin-bottom: 16px; }
    .rdc-img { width: 100%; height: 150px; object-fit: cover; border-radius: 8px; }
    .rdc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .rdc-header h3 { margin: 0; color: #2c3e50; font-size: 20px; font-weight: 600; }
    .rdc-details { display: flex; flex-direction: column; gap: 16px; }
    .detail-item { display: flex; align-items: flex-start; gap: 12px; }
    .detail-icon { font-size: 18px; width: 24px; flex-shrink: 0; }
    .detail-content { display: flex; flex-direction: column; gap: 2px; }
    .detail-label { font-size: 12px; color: #6c757d; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
    .detail-value { font-size: 14px; color: #2c3e50; font-weight: 500; }
    .rdc-actions { display: flex; gap: 16px; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e9ecef; }
    .btn-sm.btn-edit { padding: 12px 20px; font-size: 14px; font-weight: 500; border-radius: 8px; transition: all 0.2s; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white !important; border: none; }
    .btn-sm.btn-edit:hover { transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.15); background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%); color: white !important; }
    .btn-sm.btn-danger { padding: 12px 20px; font-size: 14px; font-weight: 500; border-radius: 8px; transition: all 0.2s; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); color: white !important; border: none; }
    .btn-sm.btn-danger:hover { transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.15); background: linear-gradient(135deg, #ff5252 0%, #d32f2f 100%); color: white !important; }
    .btn-sm.btn-success { padding: 12px 20px; font-size: 14px; font-weight: 500; border-radius: 8px; transition: all 0.2s; background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%); color: white !important; border: none; }
    .btn-sm.btn-success:hover { transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.15); background: linear-gradient(135deg, #26a69a 0%, #00695c 100%); color: white !important; }
    .btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-primary { background: #007bff; color: white; }
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal { background: white; padding: 32px; border-radius: 12px; width: 500px; max-width: 90vw; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
    .modal h2 { margin: 0 0 24px 0; color: #2c3e50; font-size: 24px; font-weight: 600; }
    .modal input, .modal textarea, .modal select { width: 100%; padding: 12px 16px; margin-bottom: 16px; border: 2px solid #e9ecef; border-radius: 8px; box-sizing: border-box; font-size: 14px; transition: border-color 0.2s; }
    .modal input:focus, .modal textarea:focus, .modal select:focus { outline: none; border-color: #007bff; }
    .modal label { display: block; font-weight: 600; margin-bottom: 8px; color: #495057; font-size: 14px; }
    .modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; padding-top: 20px; border-top: 1px solid #e9ecef; }
    .modal-actions .btn { padding: 12px 24px; font-size: 14px; font-weight: 500; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
    .modal-actions .btn-primary { background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); color: white; border: none; }
    .modal-actions .btn-primary:hover { background: linear-gradient(135deg, #0056b3 0%, #004085 100%); transform: translateY(-1px); }
    .modal-actions .btn:not(.btn-primary) { background: #6c757d; color: white; border: none; }
    .modal-actions .btn:not(.btn-primary):hover { background: #545b62; }
    .loading-state { text-align: center; padding: 60px 20px; color: #666; grid-column: 1 / -1; }
    .spinner { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #007bff; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .empty-state { text-align: center; padding: 60px 20px; color: #666; grid-column: 1 / -1; }
    .empty-icon { font-size: 4rem; margin-bottom: 1rem; }
    .empty-state h3 { margin: 0 0 0.5rem 0; color: #333; }
    .empty-state p { margin: 0; }
  `]
})
export class RDCManagementComponent implements OnInit {
  rdcs: RDC[] = [];
  allRdcs: RDC[] = [];
  showModal = false;
  isEditing = false;
  showAll = false;
  loading = true;
  currentRDC: RDC = { id: 0, name: '', location: '', address: '', contactNumber: '', managerName: '', active: true };

  constructor(private rdcService: RDCService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadAllRDCs();
  }

  loadAllRDCs() {
    this.loading = true;
    this.rdcService.getAllRDCs().subscribe({
      next: (rdcs) => {
        this.allRdcs = rdcs;
        this.filterRDCs();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading RDCs:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filterRDCs() {
    if (this.showAll) {
      this.rdcs = this.allRdcs;
    } else {
      this.rdcs = this.allRdcs.filter(rdc => rdc.active);
    }
    this.cdr.detectChanges();
  }

  toggleView() {
    this.showAll = !this.showAll;
    this.filterRDCs();
  }

  activateRDC(rdc: RDC) {
    Swal.fire({
      title: 'Activate RDC?',
      text: `This will reactivate ${rdc.name} RDC`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      confirmButtonText: 'Yes, activate!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rdcService.activateRDC(rdc.id).subscribe({
          next: () => {
            // Update in local arrays
            const index = this.allRdcs.findIndex(r => r.id === rdc.id);
            if (index !== -1) {
              this.allRdcs[index].active = true;
            }
            this.filterRDCs();
            Swal.fire('Activated!', 'RDC has been activated', 'success');
          },
          error: () => Swal.fire('Error', 'Failed to activate RDC', 'error')
        });
      }
    });
  }

  openAddModal() {
    this.isEditing = false;
    this.currentRDC = { id: 0, name: '', location: '', address: '', contactNumber: '', managerName: '', active: true };
    this.showModal = true;
  }

  editRDC(rdc: RDC) {
    this.isEditing = true;
    this.currentRDC = { ...rdc };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveRDC() {
    if (this.isEditing) {
      this.rdcService.updateRDC(this.currentRDC.id, this.currentRDC).subscribe({
        next: () => {
          Swal.fire('Success', 'RDC updated successfully', 'success');
          this.loadAllRDCs();
          this.closeModal();
        },
        error: () => Swal.fire('Error', 'Failed to update RDC', 'error')
      });
    } else {
      this.rdcService.createRDC(this.currentRDC).subscribe({
        next: () => {
          Swal.fire('Success', 'RDC created successfully', 'success');
          this.loadAllRDCs();
          this.closeModal();
        },
        error: () => Swal.fire('Error', 'Failed to create RDC', 'error')
      });
    }
  }

  deleteRDC(rdc: RDC) {
    Swal.fire({
      title: 'Deactivate RDC?',
      text: `This will deactivate ${rdc.name} RDC`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Yes, deactivate!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rdcService.deleteRDC(rdc.id).subscribe({
          next: () => {
            // Update in local arrays
            const index = this.allRdcs.findIndex(r => r.id === rdc.id);
            if (index !== -1) {
              this.allRdcs[index].active = false;
            }
            this.filterRDCs();
            Swal.fire('Deactivated!', 'RDC has been deactivated', 'success');
          },
          error: () => Swal.fire('Error', 'Failed to deactivate RDC', 'error')
        });
      }
    });
  }
}