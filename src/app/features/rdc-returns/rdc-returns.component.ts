import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rdc-returns',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="rdc-returns fade-in">
      <div class="returns-header">
        <h1>Returns & Disputes Management</h1>
        <div class="stats">
          <div class="stat">
            <span class="value">{{stats.pendingReturns}}</span>
            <span class="label">Pending Returns</span>
          </div>
          <div class="stat">
            <span class="value">{{stats.processedToday}}</span>
            <span class="label">Processed Today</span>
          </div>
        </div>
      </div>

      <div class="returns-tabs">
        <button class="tab" [class.active]="activeTab === 'returns'" (click)="activeTab = 'returns'">Return Requests</button>
        <button class="tab" [class.active]="activeTab === 'disputes'" (click)="activeTab = 'disputes'">Disputes</button>
        <button class="tab" [class.active]="activeTab === 'inventory'" (click)="activeTab = 'inventory'">Returned Inventory</button>
      </div>

      <!-- Return Requests Tab -->
      <div class="tab-content" *ngIf="activeTab === 'returns'">
        <div class="returns-grid">
          <div class="return-card" *ngFor="let returnItem of returnRequests" [class]="'status-' + returnItem.status.toLowerCase()">
            <div class="return-header">
              <h3>Return #{{returnItem.id}}</h3>
              <span class="status-badge" [class]="returnItem.status.toLowerCase()">{{returnItem.status}}</span>
            </div>
            
            <div class="return-details">
              <p><strong>Order:</strong> #{{returnItem.orderId}}</p>
              <p><strong>Customer:</strong> {{returnItem.customerName}}</p>
              <p><strong>Product:</strong> {{returnItem.productName}}</p>
              <p><strong>Quantity:</strong> {{returnItem.quantity}}</p>
              <p><strong>Reason:</strong> {{returnItem.reason}}</p>
              <p><strong>Requested:</strong> {{formatDate(returnItem.requestDate)}}</p>
              <p><strong>Refund Amount:</strong> Rs. {{returnItem.refundAmount | number}}</p>
            </div>

            <div class="return-description" *ngIf="returnItem.description">
              <h4>Description:</h4>
              <p>{{returnItem.description}}</p>
            </div>

            <div class="return-actions" *ngIf="returnItem.status === 'PENDING'">
              <button class="approve-btn" (click)="approveReturn(returnItem)">Approve</button>
              <button class="reject-btn" (click)="rejectReturn(returnItem)">Reject</button>
              <button class="inspect-btn" (click)="scheduleInspection(returnItem)">Schedule Inspection</button>
            </div>

            <div class="return-actions" *ngIf="returnItem.status === 'APPROVED'">
              <button class="receive-btn" (click)="receiveReturn(returnItem)">Mark as Received</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Disputes Tab -->
      <div class="tab-content" *ngIf="activeTab === 'disputes'">
        <div class="disputes-list">
          <div class="dispute-card" *ngFor="let dispute of disputes">
            <div class="dispute-header">
              <h3>Dispute #{{dispute.id}}</h3>
              <span class="priority" [class]="dispute.priority.toLowerCase()">{{dispute.priority}}</span>
            </div>
            
            <div class="dispute-details">
              <p><strong>Customer:</strong> {{dispute.customerName}}</p>
              <p><strong>Order:</strong> #{{dispute.orderId}}</p>
              <p><strong>Type:</strong> {{dispute.type}}</p>
              <p><strong>Submitted:</strong> {{formatDate(dispute.submitDate)}}</p>
            </div>

            <div class="dispute-description">
              <h4>Issue Description:</h4>
              <p>{{dispute.description}}</p>
            </div>

            <div class="dispute-resolution" *ngIf="dispute.resolution">
              <h4>Resolution:</h4>
              <p>{{dispute.resolution}}</p>
              <p><em>Resolved by: {{dispute.resolvedBy}} on {{formatDate(dispute.resolvedDate)}}</em></p>
            </div>

            <div class="dispute-actions" *ngIf="dispute.status !== 'RESOLVED'">
              <button class="resolve-btn" (click)="resolveDispute(dispute)">Resolve</button>
              <button class="escalate-btn" (click)="escalateDispute(dispute)">Escalate to HO</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Returned Inventory Tab -->
      <div class="tab-content" *ngIf="activeTab === 'inventory'">
        <div class="inventory-grid">
          <div class="inventory-card" *ngFor="let item of returnedInventory">
            <div class="inventory-header">
              <h3>{{item.productName}}</h3>
              <span class="condition" [class]="item.condition.toLowerCase()">{{item.condition}}</span>
            </div>
            
            <div class="inventory-details">
              <p><strong>Return ID:</strong> #{{item.returnId}}</p>
              <p><strong>Quantity:</strong> {{item.quantity}}</p>
              <p><strong>Received:</strong> {{formatDate(item.receivedDate)}}</p>
              <p><strong>Inspector:</strong> {{item.inspectedBy}}</p>
              <p><strong>Location:</strong> {{item.storageLocation}}</p>
            </div>

            <div class="inventory-notes" *ngIf="item.inspectionNotes">
              <h4>Inspection Notes:</h4>
              <p>{{item.inspectionNotes}}</p>
            </div>

            <div class="inventory-actions">
              <button class="restock-btn" *ngIf="item.condition === 'RESALABLE'" (click)="restockItem(item)">Restock</button>
              <button class="dispose-btn" *ngIf="item.condition === 'DAMAGED'" (click)="disposeItem(item)">Mark for Disposal</button>
              <button class="repair-btn" *ngIf="item.condition === 'REPAIRABLE'" (click)="sendForRepair(item)">Send for Repair</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .rdc-returns { padding: 40px; max-width: 1400px; margin: 0 auto; }
    .returns-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .stats { display: flex; gap: 32px; }
    .stat { text-align: center; }
    .stat .value { display: block; font-size: 24px; font-weight: 700; color: var(--primary-blue); }
    .stat .label { display: block; font-size: 12px; color: var(--gray-600); margin-top: 4px; }
    .returns-tabs { display: flex; gap: 4px; margin-bottom: 32px; }
    .tab { padding: 12px 24px; border: none; background: var(--gray-100); cursor: pointer; border-radius: var(--border-radius-md) var(--border-radius-md) 0 0; }
    .tab.active { background: white; border-bottom: 2px solid var(--primary-blue); }
    .returns-grid, .inventory-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 24px; }
    .return-card, .dispute-card, .inventory-card { background: white; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); padding: 24px; border-left: 4px solid; }
    .return-card.status-pending { border-color: var(--yellow-500); }
    .return-card.status-approved { border-color: var(--green-500); }
    .return-card.status-rejected { border-color: var(--red-500); }
    .return-header, .dispute-header, .inventory-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .status-badge { padding: 6px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .status-badge.pending { background: var(--yellow-100); color: var(--yellow-600); }
    .status-badge.approved { background: var(--green-100); color: var(--green-600); }
    .status-badge.rejected { background: var(--red-100); color: var(--red-600); }
    .priority { padding: 4px 8px; border-radius: 8px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
    .priority.high { background: var(--red-100); color: var(--red-600); }
    .priority.medium { background: var(--yellow-100); color: var(--yellow-600); }
    .priority.low { background: var(--blue-100); color: var(--blue-600); }
    .condition { padding: 4px 8px; border-radius: 8px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
    .condition.resalable { background: var(--green-100); color: var(--green-600); }
    .condition.damaged { background: var(--red-100); color: var(--red-600); }
    .condition.repairable { background: var(--yellow-100); color: var(--yellow-600); }
    .return-details, .dispute-details, .inventory-details { margin-bottom: 16px; }
    .return-details p, .dispute-details p, .inventory-details p { margin: 8px 0; font-size: 14px; }
    .return-description, .dispute-description, .dispute-resolution, .inventory-notes { margin-bottom: 16px; padding: 12px; background: var(--gray-50); border-radius: var(--border-radius-md); }
    .return-description h4, .dispute-description h4, .dispute-resolution h4, .inventory-notes h4 { margin: 0 0 8px 0; font-size: 14px; }
    .return-actions, .dispute-actions, .inventory-actions { display: flex; gap: 8px; flex-wrap: wrap; }
    .return-actions button, .dispute-actions button, .inventory-actions button { padding: 8px 16px; border: none; border-radius: var(--border-radius-md); cursor: pointer; font-size: 12px; }
    .approve-btn, .receive-btn, .restock-btn { background: var(--green-500); color: white; }
    .reject-btn, .dispose-btn { background: var(--red-500); color: white; }
    .inspect-btn, .repair-btn { background: var(--blue-500); color: white; }
    .resolve-btn { background: var(--purple-500); color: white; }
    .escalate-btn { background: var(--orange-500); color: white; }
    .disputes-list { display: grid; gap: 24px; }
  `]
})
export class RdcReturnsComponent implements OnInit {
  activeTab = 'returns';
  stats = {
    pendingReturns: 5,
    processedToday: 3
  };
  returnRequests: any[] = [];
  disputes: any[] = [];
  returnedInventory: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadReturnsData();
  }

  loadReturnsData() {
    // Mock data
    this.returnRequests = [
      {
        id: 1,
        orderId: 1001,
        customerName: 'ABC Store',
        productName: 'Product A',
        quantity: 2,
        reason: 'DAMAGED',
        description: 'Products arrived with visible damage to packaging',
        status: 'PENDING',
        requestDate: new Date('2024-01-20'),
        refundAmount: 1000
      }
    ];

    this.disputes = [
      {
        id: 1,
        customerName: 'XYZ Mart',
        orderId: 1002,
        type: 'DELIVERY_DELAY',
        priority: 'HIGH',
        description: 'Order was delivered 3 days late causing business disruption',
        status: 'PENDING',
        submitDate: new Date('2024-01-19')
      }
    ];

    this.returnedInventory = [
      {
        returnId: 1,
        productName: 'Product A',
        quantity: 2,
        condition: 'RESALABLE',
        receivedDate: new Date('2024-01-21'),
        inspectedBy: 'Kamal Perera',
        storageLocation: 'Returns-A1',
        inspectionNotes: 'Minor packaging damage, product intact'
      }
    ];
  }

  approveReturn(returnItem: any) {
    Swal.fire({
      title: 'Approve Return?',
      text: `Approve return for ${returnItem.productName} (${returnItem.quantity} units)?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Approve'
    }).then((result) => {
      if (result.isConfirmed) {
        returnItem.status = 'APPROVED';
        returnItem.approvedDate = new Date();
        Swal.fire('Approved!', 'Return request has been approved.', 'success');
      }
    });
  }

  rejectReturn(returnItem: any) {
    Swal.fire({
      title: 'Reject Return?',
      input: 'textarea',
      inputLabel: 'Reason for rejection',
      inputPlaceholder: 'Enter reason...',
      showCancelButton: true,
      confirmButtonText: 'Reject'
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        returnItem.status = 'REJECTED';
        returnItem.rejectionReason = result.value;
        Swal.fire('Rejected!', 'Return request has been rejected.', 'success');
      }
    });
  }

  scheduleInspection(returnItem: any) {
    Swal.fire({
      title: 'Schedule Inspection',
      html: `
        <input id="inspectionDate" class="swal2-input" type="date">
        <input id="inspector" class="swal2-input" placeholder="Inspector Name">
        <textarea id="notes" class="swal2-textarea" placeholder="Inspection notes"></textarea>
      `,
      showCancelButton: true,
      confirmButtonText: 'Schedule'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Scheduled!', 'Inspection has been scheduled.', 'success');
      }
    });
  }

  receiveReturn(returnItem: any) {
    Swal.fire({
      title: 'Receive Return',
      html: `
        <select id="condition" class="swal2-select">
          <option value="RESALABLE">Resalable</option>
          <option value="DAMAGED">Damaged</option>
          <option value="REPAIRABLE">Repairable</option>
        </select>
        <input id="location" class="swal2-input" placeholder="Storage Location">
        <textarea id="notes" class="swal2-textarea" placeholder="Inspection notes"></textarea>
      `,
      showCancelButton: true,
      confirmButtonText: 'Receive'
    }).then((result) => {
      if (result.isConfirmed) {
        const condition = (document.getElementById('condition') as HTMLSelectElement).value;
        const location = (document.getElementById('location') as HTMLInputElement).value;
        const notes = (document.getElementById('notes') as HTMLTextAreaElement).value;
        
        // Add to returned inventory
        this.returnedInventory.push({
          returnId: returnItem.id,
          productName: returnItem.productName,
          quantity: returnItem.quantity,
          condition: condition,
          receivedDate: new Date(),
          inspectedBy: 'Current User',
          storageLocation: location,
          inspectionNotes: notes
        });
        
        returnItem.status = 'RECEIVED';
        Swal.fire('Received!', 'Return has been received into inventory.', 'success');
      }
    });
  }

  resolveDispute(dispute: any) {
    Swal.fire({
      title: 'Resolve Dispute',
      input: 'textarea',
      inputLabel: 'Resolution details',
      inputPlaceholder: 'Enter resolution...',
      showCancelButton: true,
      confirmButtonText: 'Resolve'
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        dispute.status = 'RESOLVED';
        dispute.resolution = result.value;
        dispute.resolvedBy = 'Current User';
        dispute.resolvedDate = new Date();
        Swal.fire('Resolved!', 'Dispute has been resolved.', 'success');
      }
    });
  }

  escalateDispute(dispute: any) {
    Swal.fire({
      title: 'Escalate to Head Office?',
      text: 'This dispute will be forwarded to Head Office for review.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Escalate'
    }).then((result) => {
      if (result.isConfirmed) {
        dispute.status = 'ESCALATED';
        Swal.fire('Escalated!', 'Dispute has been escalated to Head Office.', 'success');
      }
    });
  }

  restockItem(item: any) {
    Swal.fire({
      title: 'Restock Item?',
      text: `Add ${item.quantity} units of ${item.productName} back to inventory?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Restock'
    }).then((result) => {
      if (result.isConfirmed) {
        item.status = 'RESTOCKED';
        Swal.fire('Restocked!', 'Item has been added back to inventory.', 'success');
      }
    });
  }

  disposeItem(item: any) {
    Swal.fire({
      title: 'Mark for Disposal?',
      text: `Mark ${item.quantity} units of ${item.productName} for disposal?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Mark for Disposal'
    }).then((result) => {
      if (result.isConfirmed) {
        item.status = 'DISPOSED';
        Swal.fire('Marked!', 'Item has been marked for disposal.', 'success');
      }
    });
  }

  sendForRepair(item: any) {
    Swal.fire({
      title: 'Send for Repair?',
      text: `Send ${item.quantity} units of ${item.productName} for repair?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Send for Repair'
    }).then((result) => {
      if (result.isConfirmed) {
        item.status = 'REPAIR';
        Swal.fire('Sent!', 'Item has been sent for repair.', 'success');
      }
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}