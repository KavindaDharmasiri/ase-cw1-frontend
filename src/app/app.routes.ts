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
import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { DeliveryStatusComponent } from './features/delivery-status/delivery-status.component';
import { RdcDashboardComponent } from './features/rdc-dashboard/rdc-dashboard.component';
import { RdcOrdersComponent } from './features/rdc-orders/rdc-orders.component';
import { RdcDeliveriesComponent } from './features/rdc-deliveries/rdc-deliveries.component';
import { RdcBillingComponent } from './features/rdc-billing/rdc-billing.component';
import { LogisticsDashboardComponent } from './features/logistics-dashboard/logistics-dashboard.component';
import { LogisticsRoutesComponent } from './features/logistics-routes/logistics-routes.component';
import { LogisticsDeliveriesComponent } from './features/logistics-deliveries/logistics-deliveries.component';
import { LogisticsTrackingComponent } from './features/logistics-tracking/logistics-tracking.component';
import { LogisticsReportsComponent } from './features/logistics-reports/logistics-reports.component';
import { HoDashboardComponent } from './features/ho-dashboard/ho-dashboard.component';
import { HoInventoryComponent } from './features/ho-inventory/ho-inventory.component';
import { HoReportsComponent } from './features/ho-reports/ho-reports.component';
import { HoUsersComponent } from './features/ho-users/ho-users.component';
import { HoConfigComponent } from './features/ho-config/ho-config.component';
import { RDCManagementComponent } from './features/rdc-management/rdc-management.component';
import { DeliveryZoneManagementComponent } from './features/delivery-zone-management/delivery-zone-management.component';
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
  { path: 'cart', component: CartComponent, canActivate: [RoleGuard], data: { role: 'RETAILER' } },
  { path: 'checkout', component: CheckoutComponent, canActivate: [RoleGuard], data: { role: 'RETAILER' } },
  { path: 'delivery-status/:orderId', component: DeliveryStatusComponent, canActivate: [RoleGuard], data: { role: 'RETAILER' } },
  { path: 'rdc-dashboard', component: RdcDashboardComponent, canActivate: [RoleGuard], data: { role: 'RDC_STAFF' } },
  { path: 'rdc/orders', component: RdcOrdersComponent, canActivate: [RoleGuard], data: { role: 'RDC_STAFF' } },
  { path: 'rdc/deliveries', component: RdcDeliveriesComponent, canActivate: [RoleGuard], data: { role: 'RDC_STAFF' } },
  { path: 'rdc/billing', component: RdcBillingComponent, canActivate: [RoleGuard], data: { role: 'RDC_STAFF' } },
  { path: 'logistics-dashboard', component: LogisticsDashboardComponent, canActivate: [RoleGuard], data: { role: 'LOGISTICS' } },
  { path: 'logistics/routes', component: LogisticsRoutesComponent, canActivate: [RoleGuard], data: { role: 'LOGISTICS' } },
  { path: 'logistics/deliveries', component: LogisticsDeliveriesComponent, canActivate: [RoleGuard], data: { role: 'LOGISTICS' } },
  { path: 'logistics/tracking', component: LogisticsTrackingComponent, canActivate: [RoleGuard], data: { role: 'LOGISTICS' } },
  { path: 'logistics/tracking/:routeId', component: LogisticsTrackingComponent, canActivate: [RoleGuard], data: { role: 'LOGISTICS' } },
  { path: 'logistics/reports', component: LogisticsReportsComponent, canActivate: [RoleGuard], data: { role: 'LOGISTICS' } },
  { path: 'invoices', component: InvoicesComponent, canActivate: [RoleGuard], data: { role: 'RETAILER' } },
  { path: 'reports', component: ReportsComponent, canActivate: [RoleGuard], data: { role: 'HEAD_OFFICE_MANAGER' } },
  { path: 'orders/manage', component: OrderManagementComponent, canActivate: [AuthGuard] },
  { path: 'retailer', component: DashboardComponent, canActivate: [RoleGuard], data: { role: 'RETAILER' } },
  { path: 'rdc-staff', component: RdcDashboardComponent, canActivate: [RoleGuard], data: { role: 'RDC_STAFF' } },
  { path: 'logistics', component: LogisticsDashboardComponent, canActivate: [RoleGuard], data: { role: 'LOGISTICS' } },
  { path: 'head-office', component: HoDashboardComponent, canActivate: [RoleGuard], data: { role: 'HEAD_OFFICE_MANAGER' } },
  { path: 'ho-dashboard', component: HoDashboardComponent, canActivate: [RoleGuard], data: { role: 'HEAD_OFFICE_MANAGER' } },
  { path: 'ho-inventory', component: HoInventoryComponent, canActivate: [RoleGuard], data: { role: 'HEAD_OFFICE_MANAGER' } },
  { path: 'ho-reports', component: HoReportsComponent, canActivate: [RoleGuard], data: { role: 'HEAD_OFFICE_MANAGER' } },
  { path: 'ho-users', component: HoUsersComponent, canActivate: [RoleGuard], data: { role: 'HEAD_OFFICE_MANAGER' } },
  { path: 'ho-config', component: HoConfigComponent, canActivate: [RoleGuard], data: { role: 'HEAD_OFFICE_MANAGER' } },
  { path: 'rdc-management', component: RDCManagementComponent, canActivate: [RoleGuard], data: { role: 'HEAD_OFFICE_MANAGER' } },
  { path: 'delivery-zones', component: DeliveryZoneManagementComponent, canActivate: [RoleGuard], data: { role: 'HEAD_OFFICE_MANAGER' } },
  { path: 'products', component: ProductsComponent, canActivate: [AuthGuard] },
  { path: 'product-catalog', component: ProductCatalogComponent, canActivate: [RoleGuard], data: { role: 'RETAILER' } },
  { path: 'real-time-tracking', component: RealTimeTrackingComponent, canActivate: [AuthGuard] },
  { path: 'inventory', component: InventoryComponent, canActivate: [AuthGuard] },
  { path: 'unauthorized', component: UnauthorizedComponent }
];
