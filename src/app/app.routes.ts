import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RetailerComponent } from './retailer/retailer.component';
import { RdcStaffComponent } from './rdc-staff/rdc-staff.component';
import { LogisticsComponent } from './logistics/logistics.component';
import { HeadOfficeComponent } from './head-office/head-office.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'retailer', component: RetailerComponent, canActivate: [RoleGuard], data: { role: 'RETAILER' } },
  { path: 'rdc-staff', component: RdcStaffComponent, canActivate: [RoleGuard], data: { role: 'RDC_STAFF' } },
  { path: 'logistics', component: LogisticsComponent, canActivate: [RoleGuard], data: { role: 'LOGISTICS' } },
  { path: 'head-office', component: HeadOfficeComponent, canActivate: [RoleGuard], data: { role: 'HEAD_OFFICE_MANAGER' } },
  { path: 'unauthorized', component: UnauthorizedComponent }
];
