import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-returns',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="returns-container fade-in">
      <div class="returns-header">
        <h1>Returns & Complaints</h1>
        <button class="new-request-btn" (click)="showNewRequestForm()">New Request</button>
      </div>

      <div class="tabs">
        <button class="tab" [class.active]="activeTab === 'returns'" (click)="activeTab = 'returns'">Returns</button>
        <button class="tab" [class.active]="activeTab === 'complaints'" (click)="activeTab = 'complaints'">Complaints</button>
      </div>

      <!-- Returns Tab -->
      <div class="tab-content" *ngIf="activeTab === 'returns'">
        <div class="requests-list" *ngIf="returns.length > 0">
          <div class="request-card" *ngFor="let return of returns">
            <div class="request-header">
              <h3>Return #{{return.id}}</h3>
              <span class="status-badge" [class]="return.status.toLowerCase()">{{return.status}}</span>
            </div>
            <div class="request-details">
              <p><strong>Order:</strong> #{{return.orderId}}</p>
              <p><strong>Product:</strong> {{return.productName}}</p>
              <p><strong>Reason:</strong> {{return.reason}}</p>
              <p><strong>Requested:</strong> {{formatDate(return.requestDate)}}</p>
              <p *ngIf="return.refundAmount"><strong>Refund Amount:</strong> Rs. {{return.refundAmount}}</p>
            </div>
            <div class="request-actions">
              <button class="view-btn" (click)="viewRequest(return)">View Details</button>
              <button class="cancel-btn" *ngIf="return.status === 'PENDING'" (click)="cancelRequest(return.id)">Cancel</button>
            </div>
          </div>
        </div>
        <div class="empty-state" *ngIf="returns.length === 0">
          <h3>No return requests</h3>
          <p>You haven't made any return requests yet.</p>
        </div>
      </div>

      <!-- Complaints Tab -->
      <div class="tab-content" *ngIf="activeTab === 'complaints'">
        <div class="requests-list" *ngIf="complaints.length > 0">
          <div class="request-card" *ngFor="let complaint of complaints">
            <div class="request-header">
              <h3>Complaint #{{complaint.id}}</h3>
              <span class="status-badge" [class]="complaint.status.toLowerCase()">{{complaint.status}}</span>
            </div>
            <div class="request-details">
              <p><strong>Subject:</strong> {{complaint.subject}}</p>
              <p><strong>Category:</strong> {{complaint.category}}</p>
              <p><strong>Submitted:</strong> {{formatDate(complaint.submitDate)}}</p>
              <p *ngIf="complaint.resolvedDate"><strong>Resolved:</strong> {{formatDate(complaint.resolvedDate)}}</p>
            </div>
            <div class="request-actions">
              <button class="view-btn" (click)="viewComplaint(complaint)">View Details</button>
            </div>
          </div>
        </div>
        <div class="empty-state" *ngIf="complaints.length === 0">
          <h3>No complaints</h3>
          <p>You haven't submitted any complaints yet.</p>
        </div>
      </div>

      <!-- New Request Modal -->
      <div class="modal" *ngIf="showModal" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{requestType === 'return' ? 'Request Return' : 'Submit Complaint'}}</h2>
            <button class="close-btn" (click)="closeModal()">×</button>
          </div>
          
          <form class="request-form" (ngSubmit)="submitRequest()">
            <div class="form-group" *ngIf="requestType === 'return'">
              <label>Order ID</label>
              <input type="text" [(ngModel)]="newRequest.orderId" name="orderId" required>
            </div>
            
            <div class="form-group" *ngIf="requestType === 'return'">
              <label>Product</label>
              <select [(ngModel)]="newRequest.productId" name="productId" required>
                <option value="">Select Product</option>
                <option value="1">Product A</option>
                <option value="2">Product B</option>
              </select>
            </div>

            <div class="form-group" *ngIf="requestType === 'complaint'">
              <label>Subject</label>
              <input type="text" [(ngModel)]="newRequest.subject" name="subject" required>
            </div>

            <div class="form-group">
              <label>{{requestType === 'return' ? 'Reason' : 'Category'}}</label>
              <select [(ngModel)]="newRequest.reason" name="reason" required>
                <option value="">Select {{requestType === 'return' ? 'Reason' : 'Category'}}</option>
                <option *ngIf="requestType === 'return'" value="DAMAGED">Damaged Product</option>
                <option *ngIf="requestType === 'return'" value="WRONG_ITEM">Wrong Item</option>
                <option *ngIf="requestType === 'return'" value="NOT_AS_DESCRIBED">Not as Described</option>
                <option *ngIf="requestType === 'complaint'" value="DELIVERY">Delivery Issue</option>
                <option *ngIf="requestType === 'complaint'" value="PRODUCT_QUALITY">Product Quality</option>
                <option *ngIf="requestType === 'complaint'" value="SERVICE">Customer Service</option>
              </select>
            </div>

            <div class="form-group">
              <label>Description</label>
              <textarea [(ngModel)]="newRequest.description" name="description" rows="4" required></textarea>
            </div>

            <div class="form-group" *ngIf="requestType === 'return'">
              <label>Upload Images (Optional)</label>
              <input type="file" multiple accept="image/*" (change)="onFileSelect($event)">
            </div>

            <div class="form-actions">
              <button type="button" class="cancel-btn" (click)="closeModal()">Cancel</button>
              <button type="submit" class="submit-btn">Submit {{requestType === 'return' ? 'Return' : 'Complaint'}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .returns-container { padding: 40px; max-width: 1000px; margin: 0 auto; }
    .returns-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .new-request-btn { padding: 12px 24px; background: var(--primary-blue); color: white; border: none; border-radius: var(--border-radius-md); cursor: pointer; }
    .tabs { display: flex; gap: 4px; margin-bottom: 32px; }
    .tab { padding: 12px 24px; border: none; background: var(--gray-100); cursor: pointer; border-radius: var(--border-radius-md) var(--border-radius-md) 0 0; }
    .tab.active { background: white; border-bottom: 2px solid var(--primary-blue); }
    .requests-list { display: grid; gap: 20px; }
    .request-card { background: white; padding: 24px; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); }
    .request-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .status-badge { padding: 6px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .status-badge.pending { background: var(--yellow-100); color: var(--yellow-600); }
    .status-badge.approved { background: var(--green-100); color: var(--secondary-green); }
    .status-badge.rejected { background: var(--red-100); color: var(--red-600); }
    .status-badge.resolved { background: var(--green-100); color: var(--secondary-green); }
    .request-details p { margin: 8px 0; }
    .request-actions { display: flex; gap: 12px; margin-top: 16px; }
    .view-btn, .cancel-btn { padding: 8px 16px; border: none; border-radius: var(--border-radius-md); cursor: pointer; }
    .view-btn { background: var(--gray-100); color: var(--gray-700); }
    .cancel-btn { background: var(--red-100); color: var(--red-600); }
    .empty-state { text-align: center; padding: 80px 40px; }
    .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-content { background: white; border-radius: var(--border-radius-lg); width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 24px; border-bottom: 1px solid var(--gray-200); }
    .close-btn { background: none; border: none; font-size: 24px; cursor: pointer; }
    .request-form { padding: 24px; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; margin-bottom: 8px; font-weight: 600; }
    .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 12px; border: 1px solid var(--gray-300); border-radius: var(--border-radius-md); }
    .form-actions { display: flex; gap: 12px; justify-content: flex-end; }
    .submit-btn { padding: 12px 24px; background: var(--primary-blue); color: white; border: none; border-radius: var(--border-radius-md); cursor: pointer; }
  `]
})
export class ReturnsComponent implements OnInit {
  activeTab = 'returns';
  showModal = false;
  requestType = 'return';
  returns: any[] = [];
  complaints: any[] = [];
  newRequest: any = {};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadReturns();
    this.loadComplaints();
  }

  loadReturns() {
    // Mock data
    this.returns = [
      {
        id: 1,
        orderId: 1001,
        productName: 'Product A',
        reason: 'DAMAGED',
        status: 'PENDING',
        requestDate: new Date('2024-01-20'),
        refundAmount: 1500
      }
    ];
  }

  loadComplaints() {
    // Mock data
    this.complaints = [
      {
        id: 1,
        subject: 'Late delivery',
        category: 'DELIVERY',
        status: 'RESOLVED',
        submitDate: new Date('2024-01-18'),
        resolvedDate: new Date('2024-01-19')
      }
    ];
  }

  showNewRequestForm() {
    Swal.fire({
      title: 'Select Request Type',
      showCancelButton: true,
      confirmButtonText: 'Return Request',
      cancelButtonText: 'Complaint',
      reverseButtons: true
    }).then((result) => {
      this.requestType = result.isConfirmed ? 'return' : 'complaint';
      this.newRequest = {};
      this.showModal = true;
    });
  }

  closeModal() {
    this.showModal = false;
    this.newRequest = {};
  }

  submitRequest() {
    if (this.requestType === 'return') {
      this.returns.unshift({
        id: this.returns.length + 1,
        ...this.newRequest,
        status: 'PENDING',
        requestDate: new Date()
      });
    } else {
      this.complaints.unshift({
        id: this.complaints.length + 1,
        ...this.newRequest,
        status: 'PENDING',
        submitDate: new Date()
      });
    }
    
    Swal.fire('Success', `${this.requestType === 'return' ? 'Return request' : 'Complaint'} submitted successfully!`, 'success');
    this.closeModal();
  }

  viewRequest(request: any) {
    Swal.fire({
      title: `Return #${request.id}`,
      html: `
        <div style="text-align: left;">
          <p><strong>Order:</strong> #${request.orderId}</p>
          <p><strong>Product:</strong> ${request.productName}</p>
          <p><strong>Reason:</strong> ${request.reason}</p>
          <p><strong>Status:</strong> ${request.status}</p>
          <p><strong>Requested:</strong> ${this.formatDate(request.requestDate)}</p>
        </div>
      `
    });
  }

  viewComplaint(complaint: any) {
    Swal.fire({
      title: `Complaint #${complaint.id}`,
      html: `
        <div style="text-align: left;">
          <p><strong>Subject:</strong> ${complaint.subject}</p>
          <p><strong>Category:</strong> ${complaint.category}</p>
          <p><strong>Status:</strong> ${complaint.status}</p>
          <p><strong>Submitted:</strong> ${this.formatDate(complaint.submitDate)}</p>
        </div>
      `
    });
  }

  cancelRequest(id: number) {
    Swal.fire({
      title: 'Cancel Request?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.returns = this.returns.filter(r => r.id !== id);
        Swal.fire('Cancelled', 'Return request has been cancelled.', 'success');
      }
    });
  }

  onFileSelect(event: any) {
    // Handle file upload
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}