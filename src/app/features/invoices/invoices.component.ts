import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <h2>Invoices</h2>
      
      <div class="row mb-3">
        <div class="col-md-6">
          <input type="text" class="form-control" placeholder="Search by Order ID" 
                 [(ngModel)]="searchOrderId" (keyup.enter)="searchByOrderId()">
        </div>
        <div class="col-md-6">
          <button class="btn btn-primary" (click)="searchByOrderId()">Search</button>
          <button class="btn btn-secondary ms-2" (click)="loadAllInvoices()">Show All</button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Order ID</th>
              <th>Date</th>
              <th>Subtotal</th>
              <th>Tax (10%)</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let invoice of invoices">
              <td>{{invoice.invoiceNumber}}</td>
              <td>{{invoice.order?.id}}</td>
              <td>{{invoice.invoiceDate | date:'short'}}</td>
              <td>LKR {{invoice.subtotal}}</td>
              <td>LKR {{invoice.taxAmount}}</td>
              <td><strong>LKR {{invoice.totalAmount}}</strong></td>
              <td>
                <span class="badge" [ngClass]="{
                  'bg-success': invoice.paymentStatus === 'PAID',
                  'bg-warning': invoice.paymentStatus === 'PENDING',
                  'bg-danger': invoice.paymentStatus === 'OVERDUE'
                }">
                  {{invoice.paymentStatus}}
                </span>
              </td>
              <td>
                <button class="btn btn-sm btn-info" (click)="viewInvoice(invoice)">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Invoice Detail Modal -->
      <div class="modal fade" id="invoiceModal" tabindex="-1" *ngIf="selectedInvoice">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Invoice Details</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-6">
                  <h6>Invoice Information</h6>
                  <p><strong>Invoice #:</strong> {{selectedInvoice.invoiceNumber}}</p>
                  <p><strong>Date:</strong> {{selectedInvoice.invoiceDate | date:'medium'}}</p>
                  <p><strong>Order ID:</strong> {{selectedInvoice.order?.id}}</p>
                </div>
                <div class="col-md-6">
                  <h6>Payment Summary</h6>
                  <p>Subtotal: <strong>LKR {{selectedInvoice.subtotal}}</strong></p>
                  <p>Tax (10%): <strong>LKR {{selectedInvoice.taxAmount}}</strong></p>
                  <p>Total: <strong>LKR {{selectedInvoice.totalAmount}}</strong></p>
                  <p>Status: 
                    <span class="badge" [ngClass]="{
                      'bg-success': selectedInvoice.paymentStatus === 'PAID',
                      'bg-warning': selectedInvoice.paymentStatus === 'PENDING'
                    }">
                      {{selectedInvoice.paymentStatus}}
                    </span>
                  </p>
                  <p *ngIf="selectedInvoice.paymentMethod">
                    Method: <strong>{{selectedInvoice.paymentMethod}}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class InvoicesComponent implements OnInit {
  invoices: any[] = [];
  selectedInvoice: any = null;
  searchOrderId: string = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadAllInvoices();
  }

  loadAllInvoices() {
    this.http.get<any[]>('/api/invoices').subscribe({
      next: (data) => this.invoices = data,
      error: (error) => console.error('Error loading invoices:', error)
    });
  }

  searchByOrderId() {
    if (this.searchOrderId) {
      this.http.get<any>(`/api/invoices/order/${this.searchOrderId}`).subscribe({
        next: (data) => this.invoices = [data],
        error: (error) => {
          console.error('Invoice not found:', error);
          this.invoices = [];
        }
      });
    }
  }

  viewInvoice(invoice: any) {
    this.selectedInvoice = invoice;
    const modal = new (window as any).bootstrap.Modal(document.getElementById('invoiceModal'));
    modal.show();
  }
}