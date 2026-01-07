import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rdc-billing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="rdc-billing fade-in">
      <div class="billing-header">
        <h1>Billing Support</h1>
        <div class="summary-stats">
          <div class="stat">
            <span class="label">Pending Payments</span>
            <span class="value">{{stats.pendingPayments}}</span>
          </div>
          <div class="stat">
            <span class="label">Collected Today</span>
            <span class="value">Rs. {{stats.collectedToday | number}}</span>
          </div>
        </div>
      </div>

      <div class="billing-tabs">
        <button class="tab" [class.active]="activeTab === 'pending'" (click)="activeTab = 'pending'">Pending Payments</button>
        <button class="tab" [class.active]="activeTab === 'collected'" (click)="activeTab = 'collected'">Collected Payments</button>
        <button class="tab" [class.active]="activeTab === 'invoices'" (click)="activeTab = 'invoices'">Generated Invoices</button>
      </div>

      <!-- Pending Payments Tab -->
      <div class="tab-content" *ngIf="activeTab === 'pending'">
        <div class="payments-grid">
          <div class="payment-card" *ngFor="let payment of pendingPayments">
            <div class="payment-header">
              <h3>Order #{{payment.orderId}}</h3>
              <span class="amount">Rs. {{payment.amount | number}}</span>
            </div>
            <div class="payment-details">
              <p><strong>Customer:</strong> {{payment.customerName}}</p>
              <p><strong>Method:</strong> {{payment.method}}</p>
              <p><strong>Due Date:</strong> {{formatDate(payment.dueDate)}}</p>
              <p><strong>Invoice:</strong> {{payment.invoiceNumber}}</p>
            </div>
            <div class="payment-actions">
              <button class="collect-btn" (click)="collectPayment(payment)">Mark as Collected</button>
              <button class="view-invoice-btn" (click)="viewInvoice(payment)">View Invoice</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Collected Payments Tab -->
      <div class="tab-content" *ngIf="activeTab === 'collected'">
        <div class="payments-list">
          <div class="payment-item" *ngFor="let payment of collectedPayments">
            <div class="payment-info">
              <h4>Order #{{payment.orderId}} - {{payment.customerName}}</h4>
              <p>Collected: {{formatDateTime(payment.collectedDate)}} by {{payment.collectedBy}}</p>
              <p>Method: {{payment.method}} | Reference: {{payment.reference}}</p>
            </div>
            <div class="payment-amount">
              <span class="amount">Rs. {{payment.amount | number}}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Generated Invoices Tab -->
      <div class="tab-content" *ngIf="activeTab === 'invoices'">
        <div class="invoices-grid">
          <div class="invoice-card" *ngFor="let invoice of generatedInvoices">
            <div class="invoice-header">
              <h3>{{invoice.invoiceNumber}}</h3>
              <span class="status" [class]="invoice.status.toLowerCase()">{{invoice.status}}</span>
            </div>
            <div class="invoice-details">
              <p><strong>Order:</strong> #{{invoice.orderId}}</p>
              <p><strong>Customer:</strong> {{invoice.customerName}}</p>
              <p><strong>Generated:</strong> {{formatDate(invoice.generatedDate)}}</p>
              <p><strong>Amount:</strong> Rs. {{invoice.totalAmount | number}}</p>
            </div>
            <div class="invoice-actions">
              <button class="view-btn" (click)="viewInvoice(invoice)">View</button>
              <button class="print-btn" (click)="printInvoice(invoice)">Print</button>
              <button class="email-btn" (click)="emailInvoice(invoice)">Email</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .rdc-billing { padding: 40px; max-width: 1400px; margin: 0 auto; }
    .billing-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .summary-stats { display: flex; gap: 32px; }
    .stat { text-align: center; }
    .stat .label { display: block; font-size: 12px; color: var(--gray-600); margin-bottom: 4px; }
    .stat .value { display: block; font-size: 24px; font-weight: 700; color: var(--primary-blue); }
    .billing-tabs { display: flex; gap: 4px; margin-bottom: 32px; }
    .tab { padding: 12px 24px; border: none; background: var(--gray-100); cursor: pointer; border-radius: var(--border-radius-md) var(--border-radius-md) 0 0; }
    .tab.active { background: white; border-bottom: 2px solid var(--primary-blue); }
    .payments-grid, .invoices-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 24px; }
    .payment-card, .invoice-card { background: white; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); padding: 24px; }
    .payment-header, .invoice-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .amount { font-size: 18px; font-weight: 700; color: var(--secondary-green); }
    .payment-details, .invoice-details { margin-bottom: 16px; }
    .payment-details p, .invoice-details p { margin: 8px 0; font-size: 14px; }
    .payment-actions, .invoice-actions { display: flex; gap: 8px; flex-wrap: wrap; }
    .payment-actions button, .invoice-actions button { padding: 8px 16px; border: none; border-radius: var(--border-radius-md); cursor: pointer; font-size: 12px; }
    .collect-btn { background: var(--green-500); color: white; }
    .view-invoice-btn, .view-btn { background: var(--blue-500); color: white; }
    .print-btn { background: var(--gray-500); color: white; }
    .email-btn { background: var(--purple-500); color: white; }
    .payments-list { background: white; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); }
    .payment-item { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid var(--gray-200); }
    .payment-item:last-child { border-bottom: none; }
    .payment-info h4 { margin: 0 0 8px 0; }
    .payment-info p { margin: 4px 0; font-size: 14px; color: var(--gray-600); }
    .status { padding: 6px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .status.paid { background: var(--green-100); color: var(--green-600); }
    .status.pending { background: var(--yellow-100); color: var(--yellow-600); }
    .status.overdue { background: var(--red-100); color: var(--red-600); }
  `]
})
export class RdcBillingComponent implements OnInit {
  activeTab = 'pending';
  stats = {
    pendingPayments: 8,
    collectedToday: 45000
  };
  pendingPayments: any[] = [];
  collectedPayments: any[] = [];
  generatedInvoices: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadBillingData();
  }

  loadBillingData() {
    // Mock data
    this.pendingPayments = [
      {
        orderId: 1001,
        customerName: 'ABC Store',
        amount: 2500,
        method: 'CASH_ON_DELIVERY',
        dueDate: new Date(),
        invoiceNumber: 'INV-001'
      },
      {
        orderId: 1002,
        customerName: 'XYZ Mart',
        amount: 1800,
        method: 'CASH_ON_DELIVERY',
        dueDate: new Date(),
        invoiceNumber: 'INV-002'
      }
    ];

    this.collectedPayments = [
      {
        orderId: 1000,
        customerName: 'Quick Shop',
        amount: 3200,
        method: 'CASH',
        reference: 'CASH-001',
        collectedDate: new Date(),
        collectedBy: 'Kamal Perera'
      }
    ];

    this.generatedInvoices = [
      {
        invoiceNumber: 'INV-001',
        orderId: 1001,
        customerName: 'ABC Store',
        totalAmount: 2500,
        status: 'PENDING',
        generatedDate: new Date()
      },
      {
        invoiceNumber: 'INV-002',
        orderId: 1002,
        customerName: 'XYZ Mart',
        totalAmount: 1800,
        status: 'PAID',
        generatedDate: new Date()
      }
    ];
  }

  collectPayment(payment: any) {
    Swal.fire({
      title: 'Collect Payment',
      html: `
        <div style="text-align: left;">
          <p><strong>Order:</strong> #${payment.orderId}</p>
          <p><strong>Customer:</strong> ${payment.customerName}</p>
          <p><strong>Amount:</strong> Rs. ${payment.amount}</p>
        </div>
        <input id="paymentMethod" class="swal2-input" placeholder="Payment Method" value="${payment.method}">
        <input id="reference" class="swal2-input" placeholder="Reference Number">
        <textarea id="notes" class="swal2-textarea" placeholder="Notes (optional)"></textarea>
      `,
      showCancelButton: true,
      confirmButtonText: 'Confirm Collection',
      preConfirm: () => {
        const method = (document.getElementById('paymentMethod') as HTMLInputElement).value;
        const reference = (document.getElementById('reference') as HTMLInputElement).value;
        const notes = (document.getElementById('notes') as HTMLTextAreaElement).value;
        
        if (!method) {
          Swal.showValidationMessage('Payment method is required');
          return false;
        }
        
        return { method, reference, notes };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // Move to collected payments
        this.collectedPayments.unshift({
          ...payment,
          method: result.value.method,
          reference: result.value.reference,
          notes: result.value.notes,
          collectedDate: new Date(),
          collectedBy: 'Current User'
        });
        
        // Remove from pending
        this.pendingPayments = this.pendingPayments.filter(p => p.orderId !== payment.orderId);
        this.stats.pendingPayments--;
        this.stats.collectedToday += payment.amount;
        
        Swal.fire('Collected!', 'Payment has been recorded.', 'success');
      }
    });
  }

  viewInvoice(item: any) {
    Swal.fire({
      title: `Invoice ${item.invoiceNumber || item.orderId}`,
      html: `
        <div style="text-align: left;">
          <p><strong>Customer:</strong> ${item.customerName}</p>
          <p><strong>Amount:</strong> Rs. ${item.amount || item.totalAmount}</p>
          <p><strong>Status:</strong> ${item.status || 'Pending'}</p>
        </div>
      `,
      width: 600
    });
  }

  printInvoice(invoice: any) {
    const content = `
      INVOICE ${invoice.invoiceNumber}
      ========================
      Customer: ${invoice.customerName}
      Order: #${invoice.orderId}
      Amount: Rs. ${invoice.totalAmount}
      Date: ${this.formatDate(invoice.generatedDate)}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${invoice.invoiceNumber}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  emailInvoice(invoice: any) {
    Swal.fire('Sent!', `Invoice ${invoice.invoiceNumber} has been emailed to ${invoice.customerName}.`, 'success');
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  formatDateTime(date: Date): string {
    return new Date(date).toLocaleString();
  }
}