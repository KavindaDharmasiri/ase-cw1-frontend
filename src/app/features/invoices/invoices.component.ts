import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../../core/services/invoice.service';
import { Invoice } from '../../models/invoice.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [InvoiceService],
  template: `
    <div class="invoices-container">
      <h1>💰 Invoice Management</h1>
      
      <div class="filters">
        <select [(ngModel)]="statusFilter" (change)="filterInvoices()">
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="OVERDUE">Overdue</option>
        </select>
        
        <div class="stats">
          <span class="stat">Total: {{invoices.length}}</span>
          <span class="stat">Pending: {{getPendingCount()}}</span>
          <span class="stat">Paid: {{getPaidCount()}}</span>
        </div>
      </div>

      <div class="invoices-grid">
        <div *ngFor="let invoice of filteredInvoices" class="invoice-card" 
             [ngClass]="'status-' + invoice.paymentStatus.toLowerCase()">
          <div class="invoice-header">
            <h3>{{invoice.invoiceNumber}}</h3>
            <span class="status-badge">{{invoice.paymentStatus}}</span>
          </div>
          
          <div class="invoice-details">
            <p><strong>Order:</strong> #{{invoice.order.id}}</p>
            <p><strong>Customer:</strong> {{invoice.order.customer.fullName}}</p>
            <p><strong>Date:</strong> {{formatDate(invoice.invoiceDate)}}</p>
            <p><strong>Subtotal:</strong> \${{invoice.subtotal}}</p>
            <p><strong>Tax:</strong> \${{invoice.taxAmount}}</p>
            <p><strong>Total:</strong> \${{invoice.totalAmount}}</p>
            <p *ngIf="invoice.paidDate"><strong>Paid:</strong> {{formatDate(invoice.paidDate)}}</p>
          </div>

          <div class="invoice-actions" *ngIf="invoice.paymentStatus === 'PENDING'">
            <button (click)="markAsPaid(invoice)" class="btn-pay">Mark as Paid</button>
          </div>
        </div>
      </div>

      <div *ngIf="filteredInvoices.length === 0" class="no-invoices">
        <p>No invoices found.</p>
      </div>
    </div>
  `,
  styles: [`
    .invoices-container { padding: 20px; }
    .filters { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; }
    .filters select { padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
    .stats { display: flex; gap: 20px; }
    .stat { padding: 8px 12px; background: white; border-radius: 4px; font-weight: bold; }
    .invoices-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px; }
    .invoice-card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; background: white; }
    .invoice-card.status-pending { border-left: 4px solid #f39c12; }
    .invoice-card.status-paid { border-left: 4px solid #27ae60; }
    .invoice-card.status-overdue { border-left: 4px solid #e74c3c; }
    .invoice-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
    .status-badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase; background: #ecf0f1; color: #2c3e50; }
    .invoice-details p { margin: 5px 0; }
    .invoice-actions { margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee; }
    .btn-pay { background: #27ae60; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
    .no-invoices { text-align: center; padding: 40px; color: #666; }
  `]
})
export class InvoicesComponent implements OnInit {
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];
  statusFilter = '';

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit() {
    this.loadInvoices();
  }

  loadInvoices() {
    this.invoiceService.getAllInvoices().subscribe({
      next: (invoices) => {
        this.invoices = invoices;
        this.filteredInvoices = [...this.invoices];
      },
      error: (error) => console.error('Error loading invoices:', error)
    });
  }

  filterInvoices() {
    if (this.statusFilter) {
      this.filteredInvoices = this.invoices.filter(invoice => 
        invoice.paymentStatus === this.statusFilter);
    } else {
      this.filteredInvoices = [...this.invoices];
    }
  }

  markAsPaid(invoice: Invoice) {
    Swal.fire({
      title: 'Mark as Paid',
      html: `
        <input id="paymentMethod" class="swal2-input" placeholder="Payment Method" value="Cash">
        <input id="paymentReference" class="swal2-input" placeholder="Payment Reference">
      `,
      showCancelButton: true,
      confirmButtonText: 'Mark as Paid',
      preConfirm: () => {
        const paymentMethod = (document.getElementById('paymentMethod') as HTMLInputElement).value;
        const paymentReference = (document.getElementById('paymentReference') as HTMLInputElement).value;
        
        if (!paymentMethod) {
          Swal.showValidationMessage('Payment method is required');
          return false;
        }
        
        return { paymentMethod, paymentReference };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.invoiceService.markAsPaid(
          invoice.id, 
          result.value.paymentMethod, 
          result.value.paymentReference
        ).subscribe({
          next: (updatedInvoice) => {
            const index = this.invoices.findIndex(i => i.id === invoice.id);
            if (index !== -1) {
              this.invoices[index] = updatedInvoice;
              this.filterInvoices();
            }
            Swal.fire('Success', 'Invoice marked as paid', 'success');
          },
          error: (error) => {
            Swal.fire('Error', 'Failed to update invoice', 'error');
            console.error('Error updating invoice:', error);
          }
        });
      }
    });
  }

  getPendingCount(): number {
    return this.invoices.filter(i => i.paymentStatus === 'PENDING').length;
  }

  getPaidCount(): number {
    return this.invoices.filter(i => i.paymentStatus === 'PAID').length;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}