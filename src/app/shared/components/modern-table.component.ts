import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  type?: 'text' | 'number' | 'date' | 'currency' | 'status';
  width?: string;
}

export interface TableAction {
  label: string;
  icon?: string;
  color?: 'primary' | 'secondary' | 'success' | 'danger';
  action: (item: any) => void;
}

@Component({
  selector: 'app-modern-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="table-container">
      <!-- Table Header with Search and Actions -->
      <div class="table-header" *ngIf="showHeader">
        <div class="table-title">
          <h3 *ngIf="title">{{ title }}</h3>
          <p *ngIf="subtitle">{{ subtitle }}</p>
        </div>
        
        <div class="table-actions">
          <div class="search-box" *ngIf="searchable">
            <svg class="search-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search..." 
              [(ngModel)]="searchTerm"
              (input)="onSearch()"
              class="search-input">
          </div>
          
          <ng-content select="[slot=actions]"></ng-content>
        </div>
      </div>
      
      <!-- Table -->
      <div class="table-wrapper">
        <table class="modern-table">
          <thead>
            <tr>
              <th *ngFor="let column of columns" 
                  [style.width]="column.width"
                  [class.sortable]="column.sortable"
                  (click)="onSort(column)">
                <div class="th-content">
                  <span>{{ column.label }}</span>
                  <div class="sort-icons" *ngIf="column.sortable">
                    <svg class="sort-icon" 
                         [class.active]="sortColumn === column.key && sortDirection === 'asc'"
                         viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 14l5-5 5 5z"/>
                    </svg>
                    <svg class="sort-icon" 
                         [class.active]="sortColumn === column.key && sortDirection === 'desc'"
                         viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 10l5 5 5-5z"/>
                    </svg>
                  </div>
                </div>
              </th>
              <th *ngIf="actions.length > 0" class="actions-column">Actions</th>
            </tr>
          </thead>
          
          <tbody>
            <tr *ngFor="let item of paginatedData; let i = index; trackBy: trackByFn" 
                class="table-row"
                [style.animation-delay]="i * 0.05 + 's'">
              <td *ngFor="let column of columns" [attr.data-label]="column.label">
                <div class="cell-content" [ngSwitch]="column.type">
                  <span *ngSwitchCase="'currency'" class="currency">
                    {{ item[column.key] | currency }}
                  </span>
                  <span *ngSwitchCase="'date'" class="date">
                    {{ item[column.key] | date:'short' }}
                  </span>
                  <span *ngSwitchCase="'status'" 
                        class="status-badge"
                        [ngClass]="getStatusClass(item[column.key])">
                    {{ item[column.key] }}
                  </span>
                  <span *ngSwitchDefault>{{ item[column.key] }}</span>
                </div>
              </td>
              
              <td *ngIf="actions.length > 0" class="actions-cell">
                <div class="action-buttons">
                  <button *ngFor="let action of actions"
                          class="action-btn"
                          [ngClass]="action.color || 'primary'"
                          (click)="action.action(item)"
                          [title]="action.label">
                    <svg *ngIf="action.icon" class="icon" viewBox="0 0 24 24" fill="currentColor">
                      <path [attr.d]="action.icon"/>
                    </svg>
                    <span class="action-label">{{ action.label }}</span>
                  </button>
                </div>
              </td>
            </tr>
            
            <tr *ngIf="paginatedData.length === 0" class="empty-row">
              <td [attr.colspan]="columns.length + (actions.length > 0 ? 1 : 0)" class="empty-cell">
                <div class="empty-state">
                  <svg class="empty-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <p>{{ emptyMessage || 'No data available' }}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="table-footer" *ngIf="showPagination && totalItems > pageSize">
        <div class="pagination-info">
          Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ totalItems }} entries
        </div>
        
        <div class="pagination-controls">
          <button class="page-btn" 
                  [disabled]="currentPage === 1"
                  (click)="goToPage(currentPage - 1)">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          
          <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
          
          <button class="page-btn"
                  [disabled]="currentPage === totalPages"
                  (click)="goToPage(currentPage + 1)">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .table-container {
      background: white;
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-md);
      overflow: hidden;
      border: 1px solid var(--gray-200);
    }
    
    .table-header {
      padding: 24px;
      border-bottom: 1px solid var(--gray-200);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
    }
    
    .table-title h3 {
      margin: 0 0 4px 0;
      font-size: 20px;
      font-weight: 600;
      color: var(--gray-800);
    }
    
    .table-title p {
      margin: 0;
      font-size: 14px;
      color: var(--gray-600);
    }
    
    .table-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    
    .search-box {
      position: relative;
      display: flex;
      align-items: center;
    }
    
    .search-icon {
      position: absolute;
      left: 12px;
      width: 18px;
      height: 18px;
      color: var(--gray-400);
      pointer-events: none;
    }
    
    .search-input {
      padding: 10px 12px 10px 40px;
      border: 2px solid var(--gray-200);
      border-radius: var(--border-radius);
      font-size: 14px;
      transition: all var(--transition-fast);
      min-width: 250px;
    }
    
    .search-input:focus {
      outline: none;
      border-color: var(--primary-blue);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .table-wrapper {
      overflow-x: auto;
    }
    
    .modern-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }
    
    .modern-table th {
      background: var(--gray-50);
      padding: 16px;
      text-align: left;
      font-weight: 600;
      color: var(--gray-700);
      border-bottom: 1px solid var(--gray-200);
      white-space: nowrap;
    }
    
    .modern-table th.sortable {
      cursor: pointer;
      user-select: none;
      transition: background-color var(--transition-fast);
    }
    
    .modern-table th.sortable:hover {
      background: var(--gray-100);
    }
    
    .th-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    
    .sort-icons {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    
    .sort-icon {
      width: 12px;
      height: 12px;
      color: var(--gray-400);
      transition: color var(--transition-fast);
    }
    
    .sort-icon.active {
      color: var(--primary-blue);
    }
    
    .modern-table td {
      padding: 16px;
      border-bottom: 1px solid var(--gray-100);
      vertical-align: middle;
    }
    
    .table-row {
      transition: all var(--transition-fast);
      animation: slideUp 0.3s ease-out both;
    }
    
    .table-row:hover {
      background: var(--gray-50);
    }
    
    .cell-content {
      display: flex;
      align-items: center;
    }
    
    .currency {
      font-weight: 600;
      color: var(--secondary-green);
    }
    
    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .status-badge.active {
      background: rgba(16, 185, 129, 0.1);
      color: var(--secondary-green);
    }
    
    .status-badge.inactive {
      background: rgba(239, 68, 68, 0.1);
      color: var(--error);
    }
    
    .status-badge.pending {
      background: rgba(245, 158, 11, 0.1);
      color: var(--warning);
    }
    
    .actions-column {
      width: 120px;
    }
    
    .actions-cell {
      white-space: nowrap;
    }
    
    .action-buttons {
      display: flex;
      gap: 8px;
    }
    
    .action-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 6px 12px;
      border: none;
      border-radius: var(--border-radius);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    
    .action-btn.primary {
      background: var(--primary-blue);
      color: white;
    }
    
    .action-btn.secondary {
      background: var(--gray-200);
      color: var(--gray-700);
    }
    
    .action-btn.success {
      background: var(--secondary-green);
      color: white;
    }
    
    .action-btn.danger {
      background: var(--error);
      color: white;
    }
    
    .action-btn:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }
    
    .action-btn .icon {
      width: 14px;
      height: 14px;
    }
    
    .empty-row td {
      padding: 60px 20px;
    }
    
    .empty-state {
      text-align: center;
      color: var(--gray-500);
    }
    
    .empty-icon {
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }
    
    .table-footer {
      padding: 16px 24px;
      border-top: 1px solid var(--gray-200);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--gray-50);
    }
    
    .pagination-info {
      font-size: 14px;
      color: var(--gray-600);
    }
    
    .pagination-controls {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .page-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: 1px solid var(--gray-300);
      background: white;
      border-radius: var(--border-radius);
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    
    .page-btn:hover:not(:disabled) {
      background: var(--primary-blue);
      color: white;
      border-color: var(--primary-blue);
    }
    
    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .page-btn .icon {
      width: 16px;
      height: 16px;
    }
    
    .page-info {
      font-size: 14px;
      font-weight: 500;
      color: var(--gray-700);
    }
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .table-header {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
      }
      
      .search-input {
        min-width: 200px;
      }
      
      .action-label {
        display: none;
      }
      
      .table-footer {
        flex-direction: column;
        gap: 12px;
        text-align: center;
      }
    }
  `]
})
export class ModernTableComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() actions: TableAction[] = [];
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() searchable = true;
  @Input() showHeader = true;
  @Input() showPagination = true;
  @Input() pageSize = 10;
  @Input() emptyMessage?: string;
  
  @Output() sortChanged = new EventEmitter<{column: string, direction: 'asc' | 'desc'}>();
  @Output() searchChanged = new EventEmitter<string>();
  
  searchTerm = '';
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage = 1;
  
  filteredData: any[] = [];
  paginatedData: any[] = [];
  
  ngOnInit() {
    this.filteredData = [...this.data];
    this.updatePaginatedData();
  }
  
  ngOnChanges() {
    this.filteredData = [...this.data];
    this.onSearch();
  }
  
  onSearch() {
    if (!this.searchTerm.trim()) {
      this.filteredData = [...this.data];
    } else {
      this.filteredData = this.data.filter(item =>
        this.columns.some(column =>
          String(item[column.key]).toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      );
    }
    this.currentPage = 1;
    this.updatePaginatedData();
    this.searchChanged.emit(this.searchTerm);
  }
  
  onSort(column: TableColumn) {
    if (!column.sortable) return;
    
    if (this.sortColumn === column.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column.key;
      this.sortDirection = 'asc';
    }
    
    this.filteredData.sort((a, b) => {
      const aVal = a[column.key];
      const bVal = b[column.key];
      
      if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    this.updatePaginatedData();
    this.sortChanged.emit({column: this.sortColumn, direction: this.sortDirection});
  }
  
  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedData();
  }
  
  updatePaginatedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.filteredData.slice(startIndex, endIndex);
  }
  
  getStatusClass(status: string): string {
    return status.toLowerCase().replace(/\s+/g, '-');
  }
  
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
  
  get totalItems(): number {
    return this.filteredData.length;
  }
  
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }
  
  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }
  
  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.totalItems);
  }
}