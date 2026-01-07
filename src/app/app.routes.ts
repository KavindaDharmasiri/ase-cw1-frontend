import { Routes } from '@angular/router';
import { RegisterComponent } from './features/auth/register/register.component';
import { LoginComponent } from './features/auth/login/login.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';
import { ProductsComponent } from './features/products/products/products.component';
import { ProductCatalogComponent } from './features/products/product-catalog/product-catalog.component';
import { BulkUploadComponent } from './features/products/bulk-upload/bulk-upload.component';
import { RealTimeTrackingComponent } from './features/tracking/real-time-tracking.component';
import { ProfileComponent } from './features/profile/profile.component';
import { AdminPanelComponent } from './features/admin/admin-panel.component';
import { InventoryComponent } from './features/inventory/inventory/inventory.component';
import { UnauthorizedComponent } from './features/auth/unauthorized/unauthorized.component';
import { AnalyticsComponent } from './features/dashboard/analytics/analytics.component';
import { OrderPlacementComponent } from './features/orders/order-placement/order-placement.component';
import { DeliveryTrackingComponent } from './features/delivery-tracking/delivery-tracking.component';
import { StockTransferComponent } from './features/stock-transfer/stock-transfer.component';
import { OrderTrackingComponent } from './features/order-tracking/order-tracking.component';
import { InvoicesComponent } from './features/invoices/invoices.component';
import { ReportsComponent } from './features/reports/reports.component';
import { OrderManagementComponent } from './features/orders/order-management/order-management.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminPanelComponent, canActivate: [RoleGuard], data: { role: 'HEAD_OFFICE_MANAGER' } },
  { path: 'bulk-upload', component: BulkUploadComponent, canActivate: [RoleGuard], data: { role: 'HEAD_OFFICE_MANAGER' } },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'analytics', component: AnalyticsComponent, canActivate: [RoleGuard], data: { role: 'HEAD_OFFICE_MANAGER' } },
  { path: 'orders/place', component: OrderPlacementComponent, canActivate: [RoleGuard], data: { role: 'RETAILER' } },
  { path: 'delivery-tracking', component: DeliveryTrackingComponent, canActivate: [RoleGuard], data: { role: 'LOGISTICS' } },
  { path: 'stock-transfers', component: StockTransferComponent, canActivate: [RoleGuard], data: { role: 'RDC_STAFF' } },
  { path: 'orders', component: OrderTrackingComponent, canActivate: [RoleGuard], data: { role: 'RETAILER' } },
  { path: 'invoices', component: InvoicesComponent, canActivate: [RoleGuard], data: { role: 'HEAD_OFFICE_MANAGER' } },
  { path: 'reports', component: ReportsComponent, canActivate: [RoleGuard], data: { role: 'HEAD_OFFICE_MANAGER' } },
  { path: 'orders/manage', component: OrderManagementComponent, canActivate: [AuthGuard] },
  { path: 'retailer', component: DashboardComponent, canActivate: [RoleGuard], data: { role: 'RETAILER' } },
  { path: 'rdc-staff', component: DashboardComponent, canActivate: [RoleGuard], data: { role: 'RDC_STAFF' } },
  { path: 'logistics', component: DashboardComponent, canActivate: [RoleGuard], data: { role: 'LOGISTICS' } },
  { path: 'head-office', component: DashboardComponent, canActivate: [RoleGuard], data: { role: 'HEAD_OFFICE_MANAGER' } },
  { path: 'products', component: ProductsComponent, canActivate: [AuthGuard] },
  { path: 'product-catalog', component: ProductCatalogComponent, canActivate: [RoleGuard], data: { role: 'RETAILER' } },
  { path: 'real-time-tracking', component: RealTimeTrackingComponent, canActivate: [AuthGuard] },
  { path: 'inventory', component: InventoryComponent, canActivate: [AuthGuard] },
  { path: 'unauthorized', component: UnauthorizedComponent }
];
