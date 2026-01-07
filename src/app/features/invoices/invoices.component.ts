import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { PaymentService } from '../../core/services/payment.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [],
  template: `
    <div class="invoices-container fade-in">
      <h1>My Invoices</h1>
      
      <div class="invoices-list" *ngIf="invoices.length > 0">
        <div class="invoice-card" *ngFor="let invoice of invoices">
          <div class="invoice-header">
            <h3>Invoice #{{invoice.id}}</h3>
            <span class="invoice-date">{{formatDate(invoice.paymentDate)}}</span>
          </div>
          <div class="invoice-details">
            <p><strong>Order ID:</strong> {{invoice.orderId}}</p>
            <p><strong>Amount:</strong> Rs. {{invoice.amount | number:'1.2-2'}}</p>
            <p><strong>Payment Method:</strong> {{invoice.method}}</p>
            <p><strong>Status:</strong> 
              <span class="status" [class]="invoice.status?.toLowerCase()">{{invoice.status}}</span>
            </p>
            <p *ngIf="invoice.transactionId"><strong>Transaction ID:</strong> {{invoice.transactionId}}</p>
          </div>
          <div class="invoice-actions">
            <button class="btn-download" (click)="downloadInvoice(invoice.id)">Download PDF</button>
            <button class="btn-view" (click)="viewInvoice(invoice)">View Details</button>
          </div>
        </div>
      </div>

      <div class="empty-invoices" *ngIf="invoices.length === 0">
        <h2>No invoices found</h2>
        <p>Your invoices will appear here after placing orders.</p>
      </div>
    </div>
  `,
  styles: [`
    .invoices-container { padding: 40px; max-width: 1000px; margin: 0 auto; }
    .invoices-list { display: grid; gap: 20px; }
    .invoice-card { background: white; padding: 24px; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); }
    .invoice-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .invoice-header h3 { margin: 0; color: var(--gray-800); }
    .invoice-date { color: var(--gray-600); font-size: 14px; }
    .invoice-details p { margin: 8px 0; }
    .status { padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .status.completed { background: var(--green-100); color: var(--secondary-green); }
    .status.pending { background: var(--yellow-100); color: var(--yellow-600); }
    .status.failed { background: var(--red-100); color: var(--red-600); }
    .invoice-actions { display: flex; gap: 12px; margin-top: 16px; }
    .btn-download, .btn-view { padding: 8px 16px; border: none; border-radius: var(--border-radius-md); cursor: pointer; }
    .btn-download { background: var(--primary-blue); color: white; }
    .btn-view { background: var(--gray-100); color: var(--gray-700); }
    .empty-invoices { text-align: center; padding: 80px 40px; }
  `]
})
export class InvoicesComponent implements OnInit {
  invoices: any[] = [];

  constructor(
    private authService: AuthService,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    this.loadInvoices();
  }

  loadInvoices() {
    this.paymentService.getPaymentHistory().subscribe({
      next: (payments) => {
        this.invoices = payments;
      },
      error: () => {
        // Mock data for demo
        this.invoices = [
          {
            id: 1,
            orderId: 1001,
            amount: 2500.00,
            method: 'ONLINE',
            status: 'COMPLETED',
            transactionId: 'TXN_12345678',
            paymentDate: new Date('2024-01-15')
          },
          {
            id: 2,
            orderId: 1002,
            amount: 1800.00,
            method: 'CASH_ON_DELIVERY',
            status: 'PENDING',
            paymentDate: new Date('2024-01-20')
          }
        ];
      }
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  downloadInvoice(invoiceId: number) {
    // Generate PDF content
    const pdfContent = `
      INVOICE #${invoiceId}
      ==================
      
      Date: ${new Date().toLocaleDateString()}
      Customer: ${this.authService.getUsername()}
      
      Order Details:
      - Order ID: ${invoiceId}
      - Amount: Rs. ${this.invoices.find(i => i.id === invoiceId)?.amount || 0}
      
      Thank you for your business!
    `;
    
    // Create and download file
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${invoiceId}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    Swal.fire('Downloaded', `Invoice #${invoiceId} has been downloaded.`, 'success');
  }

  viewInvoice(invoice: any) {
    Swal.fire({
      title: `Invoice #${invoice.id}`,
      html: `
        <div style="text-align: left;">
          <p><strong>Order ID:</strong> ${invoice.orderId}</p>
          <p><strong>Amount:</strong> Rs. ${invoice.amount}</p>
          <p><strong>Payment Method:</strong> ${invoice.method}</p>
          <p><strong>Status:</strong> ${invoice.status}</p>
          <p><strong>Date:</strong> ${this.formatDate(invoice.paymentDate)}</p>
          ${invoice.transactionId ? `<p><strong>Transaction ID:</strong> ${invoice.transactionId}</p>` : ''}
        </div>
      `,
      confirmButtonText: 'Close'
    });
  }
}