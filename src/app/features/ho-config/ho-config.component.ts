import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../core/services/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ho-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ho-config">
      <div class="header">
        <h1>System Configuration</h1>
        <p>Manage business rules, settings, and system parameters</p>
      </div>

      <div class="config-tabs">
        <button class="tab-btn" [class.active]="activeTab === 'products'" (click)="setActiveTab('products')">
          Product Master
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'pricing'" (click)="setActiveTab('pricing')">
          Pricing & Promotions
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'payments'" (click)="setActiveTab('payments')">
          Payment Gateways
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'business'" (click)="setActiveTab('business')">
          Business Rules
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'notifications'" (click)="setActiveTab('notifications')">
          Notifications
        </button>
      </div>

      <div class="config-content">
        <!-- Product Master Data -->
        <div *ngIf="activeTab === 'products'" class="config-section">
          <h2>Product Master Data Management</h2>
          <div class="product-management">
            <div class="product-actions">
              <button class="action-btn primary" (click)="showAddProduct = true">Add New Product</button>
              <button class="action-btn" (click)="bulkImport()">Bulk Import</button>
              <button class="action-btn" (click)="exportProducts()">Export Products</button>
            </div>
            
            <div class="product-categories">
              <h3>Product Categories</h3>
              <div class="category-list">
                <div *ngIf="productCategories.length === 0" class="no-categories">
                  No categories found. Click "Add Category" to create one.
                </div>
                <div class="category-item" *ngFor="let category of productCategories; trackBy: trackByCategory">
                  <span class="category-name">{{category.name}}</span>
                  <span class="category-count">{{category.productCount}} products</span>
                  <div class="category-actions">
                    <button class="edit-btn" (click)="editCategory(category)">Edit</button>
                    <button class="delete-btn" (click)="deleteCategory(category)">Delete</button>
                  </div>
                </div>
              </div>
              <button class="add-category-btn" (click)="showAddCategory = true">Add Category</button>
            </div>
          </div>
        </div>

        <!-- Add Category Modal -->
        <div class="modal" *ngIf="showAddCategory" (click)="closeModal($event)">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>Add New Category</h2>
              <button class="close-btn" (click)="showAddCategory = false">×</button>
            </div>
            <form class="category-form" (ngSubmit)="addCategory(); $event.preventDefault();">
              <div class="form-group">
                <label>Category Name</label>
                <input type="text" [(ngModel)]="newCategory.name" name="name" required>
              </div>
              <div class="form-group">
                <label>Description</label>
                <textarea [(ngModel)]="newCategory.description" name="description" rows="3"></textarea>
              </div>
              <div class="form-actions">
                <button type="button" class="cancel-btn" (click)="showAddCategory = false">Cancel</button>
                <button type="submit" class="submit-btn">Add Category</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Edit Category Modal -->
        <div class="modal" *ngIf="showEditCategory" (click)="closeEditModal($event)">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>Edit Category</h2>
              <button class="close-btn" (click)="showEditCategory = false">×</button>
            </div>
            <form class="category-form" (ngSubmit)="updateCategory(); $event.preventDefault();">
              <div class="form-group">
                <label>Category Name</label>
                <input type="text" [(ngModel)]="editingCategory.name" name="editName" required>
              </div>
              <div class="form-group">
                <label>Description</label>
                <textarea [(ngModel)]="editingCategory.description" name="editDescription" rows="3"></textarea>
              </div>
              <div class="form-actions">
                <button type="button" class="cancel-btn" (click)="showEditCategory = false">Cancel</button>
                <button type="submit" class="submit-btn">Update Category</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Pricing & Promotions -->
        <div *ngIf="activeTab === 'pricing'" class="config-section">
          <h2>Pricing & Promotions Management</h2>
          <div class="pricing-management">
            <div class="pending-approvals">
              <h3>Pending Price Updates</h3>
              <div class="approval-list">
                <div class="approval-item" *ngFor="let update of pendingPriceUpdates">
                  <div class="update-info">
                    <h4>{{update.productName}}</h4>
                    <div class="price-change">
                      <span class="old-price">Rs. {{update.oldPrice}}</span>
                      <span class="arrow">→</span>
                      <span class="new-price">Rs. {{update.newPrice}}</span>
                    </div>
                    <div class="update-details">
                      Requested by: {{update.requestedBy}} • {{update.requestDate | date:'short'}}
                    </div>
                  </div>
                  <div class="approval-actions">
                    <button class="approve-btn" (click)="approvePriceUpdate(update)">Approve</button>
                    <button class="reject-btn" (click)="rejectPriceUpdate(update)">Reject</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="promotions">
              <h3>Active Promotions</h3>
              <div class="promotion-list">
                <div class="promotion-item" *ngFor="let promo of activePromotions">
                  <div class="promo-info">
                    <h4>{{promo.name}}</h4>
                    <div class="promo-details">
                      {{promo.discount}}% off • Valid until {{promo.endDate | date:'short'}}
                    </div>
                  </div>
                  <div class="promo-actions">
                    <button class="edit-btn" (click)="editPromotion(promo)">Edit</button>
                    <button class="deactivate-btn" (click)="deactivatePromotion(promo)">Deactivate</button>
                  </div>
                </div>
              </div>
              <button class="add-promo-btn" (click)="showAddPromotion = true">Create Promotion</button>
            </div>
          </div>
        </div>

        <!-- Payment Gateways -->
        <div *ngIf="activeTab === 'payments'" class="config-section">
          <h2>Payment Gateway Configuration</h2>
          <div class="payment-config">
            <div class="gateway-list">
              <div class="gateway-item" *ngFor="let gateway of paymentGateways">
                <div class="gateway-info">
                  <h4>{{gateway.name}}</h4>
                  <div class="gateway-status" [class]="gateway.status.toLowerCase()">
                    {{gateway.status}}
                  </div>
                </div>
                <div class="gateway-settings">
                  <div class="setting-row">
                    <label>API Key:</label>
                    <input type="password" [(ngModel)]="gateway.apiKey" class="setting-input">
                  </div>
                  <div class="setting-row">
                    <label>Merchant ID:</label>
                    <input type="text" [(ngModel)]="gateway.merchantId" class="setting-input">
                  </div>
                  <div class="setting-row">
                    <label>Transaction Fee:</label>
                    <input type="number" [(ngModel)]="gateway.transactionFee" class="setting-input">
                    <span>%</span>
                  </div>
                </div>
                <div class="gateway-actions">
                  <button class="test-btn" (click)="testGateway(gateway)">Test Connection</button>
                  <button class="save-btn" (click)="saveGatewayConfig(gateway)">Save</button>
                  <button class="toggle-btn" [class]="gateway.status.toLowerCase()" 
                          (click)="toggleGateway(gateway)">
                    {{gateway.status === 'Active' ? 'Disable' : 'Enable'}}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Business Rules -->
        <div *ngIf="activeTab === 'business'" class="config-section">
          <h2>Business Rules & Thresholds</h2>
          <div class="business-rules">
            <div class="rule-category">
              <h3>Inventory Rules</h3>
              <div class="rule-item">
                <label>Minimum Stock Alert Threshold:</label>
                <input type="number" [(ngModel)]="businessRules.minStockThreshold" class="rule-input">
                <span>units</span>
              </div>
              <div class="rule-item">
                <label>Auto Reorder Threshold:</label>
                <input type="number" [(ngModel)]="businessRules.reorderThreshold" class="rule-input">
                <span>units</span>
              </div>
              <div class="rule-item">
                <label>Maximum Stock Level:</label>
                <input type="number" [(ngModel)]="businessRules.maxStockLevel" class="rule-input">
                <span>units</span>
              </div>
            </div>

            <div class="rule-category">
              <h3>Order Rules</h3>
              <div class="rule-item">
                <label>Minimum Order Value:</label>
                <input type="number" [(ngModel)]="businessRules.minOrderValue" class="rule-input">
                <span>Rs.</span>
              </div>
              <div class="rule-item">
                <label>Free Delivery Threshold:</label>
                <input type="number" [(ngModel)]="businessRules.freeDeliveryThreshold" class="rule-input">
                <span>Rs.</span>
              </div>
              <div class="rule-item">
                <label>Order Processing Time:</label>
                <input type="number" [(ngModel)]="businessRules.processingTime" class="rule-input">
                <span>hours</span>
              </div>
            </div>

            <div class="rule-category">
              <h3>Delivery Rules</h3>
              <div class="rule-item">
                <label>Standard Delivery Time:</label>
                <input type="number" [(ngModel)]="businessRules.standardDeliveryTime" class="rule-input">
                <span>days</span>
              </div>
              <div class="rule-item">
                <label>Express Delivery Time:</label>
                <input type="number" [(ngModel)]="businessRules.expressDeliveryTime" class="rule-input">
                <span>hours</span>
              </div>
              <div class="rule-item">
                <label>Delivery Radius:</label>
                <input type="number" [(ngModel)]="businessRules.deliveryRadius" class="rule-input">
                <span>km</span>
              </div>
            </div>

            <button class="save-rules-btn" (click)="saveBusinessRules()">Save All Rules</button>
          </div>
        </div>

        <!-- Notifications -->
        <div *ngIf="activeTab === 'notifications'" class="config-section">
          <h2>Notification Settings</h2>
          <div class="notification-config">
            <div class="notification-types">
              <div class="notification-item" *ngFor="let notification of notificationSettings">
                <div class="notification-info">
                  <h4>{{notification.name}}</h4>
                  <p>{{notification.description}}</p>
                </div>
                <div class="notification-settings">
                  <label class="checkbox-label">
                    <input type="checkbox" [(ngModel)]="notification.email">
                    Email
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" [(ngModel)]="notification.sms">
                    SMS
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" [(ngModel)]="notification.push">
                    Push
                  </label>
                </div>
              </div>
            </div>
            <button class="save-notifications-btn" (click)="saveNotificationSettings()">Save Settings</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ho-config {
      padding: 2rem;
      background: #f8fafc;
      min-height: 100vh;
    }

    .header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .config-tabs {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .tab-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      background: white;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .tab-btn.active {
      background: #3b82f6;
      color: white;
    }

    .config-content {
      background: white;
      border-radius: 10px;
      padding: 2rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .config-section h2 {
      margin-bottom: 1.5rem;
      color: #1f2937;
    }

    .product-actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .action-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
    }

    .action-btn.primary {
      background: #3b82f6;
      color: white;
    }

    .action-btn:not(.primary) {
      background: #f3f4f6;
      color: #374151;
    }

    .category-list {
      margin-bottom: 1rem;
    }

    .category-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      margin-bottom: 0.5rem;
    }

    .category-count {
      color: #6b7280;
      font-size: 0.9rem;
    }

    .category-actions {
      display: flex;
      gap: 0.5rem;
    }

    .edit-btn, .delete-btn {
      padding: 0.25rem 0.75rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.8rem;
    }

    .edit-btn {
      background: #f59e0b;
      color: white;
    }

    .delete-btn {
      background: #ef4444;
      color: white;
    }

    .approval-list, .promotion-list {
      margin-bottom: 1.5rem;
    }

    .approval-item, .promotion-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .price-change {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0.5rem 0;
    }

    .old-price {
      text-decoration: line-through;
      color: #6b7280;
    }

    .new-price {
      font-weight: bold;
      color: #10b981;
    }

    .approve-btn, .reject-btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-left: 0.5rem;
    }

    .approve-btn {
      background: #10b981;
      color: white;
    }

    .reject-btn {
      background: #ef4444;
      color: white;
    }

    .gateway-item {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1rem;
    }

    .gateway-status.active {
      color: #10b981;
      font-weight: bold;
    }

    .gateway-status.inactive {
      color: #ef4444;
      font-weight: bold;
    }

    .setting-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .setting-row label {
      min-width: 120px;
      font-weight: 600;
    }

    .setting-input {
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      flex: 1;
    }

    .gateway-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .test-btn, .save-btn, .toggle-btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .test-btn {
      background: #f59e0b;
      color: white;
    }

    .save-btn {
      background: #10b981;
      color: white;
    }

    .toggle-btn.active {
      background: #ef4444;
      color: white;
    }

    .toggle-btn.inactive {
      background: #10b981;
      color: white;
    }

    .rule-category {
      margin-bottom: 2rem;
      padding: 1.5rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
    }

    .rule-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .rule-item label {
      min-width: 200px;
      font-weight: 600;
    }

    .rule-input {
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      width: 100px;
    }

    .save-rules-btn, .save-notifications-btn {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      margin-top: 1rem;
    }

    .notification-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .notification-settings {
      display: flex;
      gap: 1rem;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 10px;
      padding: 2rem;
      width: 90%;
      max-width: 500px;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
    }

    .category-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    .form-group input, .form-group textarea {
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 1rem;
    }

    .cancel-btn {
      background: #6b7280;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
    }

    .add-category-btn {
      background: #10b981;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      margin-top: 1rem;
      transition: all 0.3s ease;
    }

    .submit-btn {
      background: #10b981;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .no-categories {
      text-align: center;
      color: #6b7280;
      padding: 2rem;
      font-style: italic;
    }
  `]
})
export class HoConfigComponent implements OnInit {
  activeTab = 'products';
  showAddProduct = false;
  showAddCategory = false;
  showEditCategory = false;
  showAddPromotion = false;
  editingCategory: any = null;

  constructor(private categoryService: CategoryService, private cdr: ChangeDetectorRef) {}

  productCategories: any[] = [];

  pendingPriceUpdates = [
    { productName: 'Samsung TV 55"', oldPrice: 125000, newPrice: 119000, requestedBy: 'Colombo RDC Manager', requestDate: new Date() },
    { productName: 'Nike Running Shoes', oldPrice: 15000, newPrice: 16500, requestedBy: 'Kandy RDC Manager', requestDate: new Date() }
  ];

  activePromotions = [
    { name: 'New Year Sale', discount: 15, endDate: new Date(2024, 1, 15) },
    { name: 'Electronics Clearance', discount: 25, endDate: new Date(2024, 0, 31) }
  ];

  paymentGateways = [
    { name: 'PayHere', status: 'Active', apiKey: '****', merchantId: 'ISLANDLINK001', transactionFee: 2.5 },
    { name: 'Visa/MasterCard', status: 'Active', apiKey: '****', merchantId: 'IL_VISA_001', transactionFee: 3.0 },
    { name: 'Bank Transfer', status: 'Inactive', apiKey: '****', merchantId: 'IL_BANK_001', transactionFee: 1.0 }
  ];

  businessRules = {
    minStockThreshold: 20,
    reorderThreshold: 50,
    maxStockLevel: 1000,
    minOrderValue: 1000,
    freeDeliveryThreshold: 5000,
    processingTime: 24,
    standardDeliveryTime: 3,
    expressDeliveryTime: 24,
    deliveryRadius: 50
  };

  notificationSettings = [
    { name: 'Low Stock Alert', description: 'Alert when stock falls below threshold', email: true, sms: false, push: true },
    { name: 'Order Confirmation', description: 'Confirm new orders', email: true, sms: true, push: true },
    { name: 'Payment Received', description: 'Notify when payment is received', email: true, sms: false, push: false },
    { name: 'Delivery Updates', description: 'Delivery status updates', email: false, sms: true, push: true }
  ];

  newCategory = {
    name: '',
    description: ''
  };

  ngOnInit(): void {
    console.log('ngOnInit called');
    setTimeout(() => {
      this.loadCategories();
    }, 100);
  }

  loadCategories(): void {
    console.log('Loading categories from API...');
    this.categoryService.getAllCategories().subscribe({
      next: (categories: any) => {
        console.log('API Response:', categories);
        console.log('Is array?', Array.isArray(categories));
        console.log('Length:', categories?.length);
        
        this.productCategories = [];
        
        if (Array.isArray(categories) && categories.length > 0) {
          this.productCategories = categories.map((cat: any) => {
            console.log('Mapping category:', cat);
            return {
              id: cat.id,
              name: cat.name,
              description: cat.description || '',
              productCount: cat.products ? cat.products.length : 0
            };
          });
        }
        
        console.log('Final productCategories:', this.productCategories);
        console.log('productCategories length:', this.productCategories.length);
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error loading categories:', error);
        this.productCategories = [];
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  editCategory(category: any): void {
    console.log('Editing category with data:', category);
    this.editingCategory = { 
      id: category.id,
      name: category.name, 
      description: category.description || '' 
    };
    console.log('editingCategory set to:', this.editingCategory);
    this.showEditCategory = true;
  }

  updateCategory(): void {
    if (this.editingCategory && this.editingCategory.name.trim()) {
      this.categoryService.updateCategory(this.editingCategory.id, this.editingCategory).subscribe({
        next: () => {
          this.showEditCategory = false;
          this.editingCategory = null;
          this.loadCategories();
          Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: 'Category updated successfully',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: (error: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Failed to update category. Please try again.'
          });
        }
      });
    }
  }

  closeEditModal(event: any): void {
    if (event.target.classList.contains('modal')) {
      this.showEditCategory = false;
    }
  }

  deleteCategory(category: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete the category "${category.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategory(category.id).subscribe({
          next: () => {
            this.loadCategories();
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Category has been deleted.',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (error: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Failed to delete category. Please try again.'
            });
          }
        });
      }
    });
  }

  bulkImport(): void {
    console.log('Bulk importing products');
  }

  exportProducts(): void {
    console.log('Exporting products');
  }

  approvePriceUpdate(update: any): void {
    console.log('Approving price update:', update);
  }

  rejectPriceUpdate(update: any): void {
    console.log('Rejecting price update:', update);
  }

  editPromotion(promo: any): void {
    console.log('Editing promotion:', promo);
  }

  deactivatePromotion(promo: any): void {
    console.log('Deactivating promotion:', promo);
  }

  testGateway(gateway: any): void {
    console.log('Testing gateway:', gateway);
  }

  saveGatewayConfig(gateway: any): void {
    console.log('Saving gateway config:', gateway);
  }

  toggleGateway(gateway: any): void {
    gateway.status = gateway.status === 'Active' ? 'Inactive' : 'Active';
  }

  saveBusinessRules(): void {
    console.log('Saving business rules:', this.businessRules);
  }

  saveNotificationSettings(): void {
    console.log('Saving notification settings:', this.notificationSettings);
  }

  addCategory(): void {
    if (this.newCategory.name.trim()) {
      this.categoryService.createCategory(this.newCategory).subscribe({
        next: (savedCategory: any) => {
          this.newCategory = { name: '', description: '' };
          this.showAddCategory = false;
          this.loadCategories();
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Category created successfully',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: (error: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Failed to create category. Please try again.'
          });
        }
      });
    }
  }

  closeModal(event: any): void {
    if (event.target.classList.contains('modal')) {
      this.showAddCategory = false;
    }
  }

  trackByCategory(index: number, category: any): any {
    return category.id || index;
  }
}