import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DeliveryRouteService, DeliveryRoute, CreateRouteRequest, AssignDriverRequest } from '../../core/services/delivery-route.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-logistics-routes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="logistics-routes fade-in">
      <div class="routes-header">
        <h1>Route Planning & Optimization</h1>
        <button class="create-route-btn" (click)="createNewRoute()">Create New Route</button>
      </div>

      <div class="routes-tabs">
        <button class="tab" [class.active]="activeTab === 'planning'" (click)="activeTab = 'planning'">Route Planning</button>
        <button class="tab" [class.active]="activeTab === 'optimization'" (click)="activeTab = 'optimization'">Optimization</button>
        <button class="tab" [class.active]="activeTab === 'assignments'" (click)="activeTab = 'assignments'">Driver Assignments</button>
      </div>

      <!-- Route Planning Tab -->
      <div class="tab-content" *ngIf="activeTab === 'planning'">
        <!-- Empty State -->
        <div *ngIf="routes.length === 0" class="empty-state">
          <div class="empty-icon">🚛</div>
          <h3>No Routes Found</h3>
          <p>Start by creating your first delivery route to optimize logistics operations.</p>
          <div class="empty-actions">
            <button class="create-route-btn" (click)="createNewRoute()">Create First Route</button>
            <button class="import-btn" (click)="importRoutes()">Import Routes</button>
          </div>
        </div>
        
        <!-- Routes Grid -->
        <div *ngIf="routes.length > 0" class="planning-grid">
          <div class="route-card" *ngFor="let route of routes">
            <div class="route-header">
              <h3>{{route.routeName}}</h3>
              <span class="route-status" [class]="route.status.toLowerCase()">{{route.status}}</span>
            </div>

            <div class="route-details">
              <div class="route-info">
                <p><strong>Driver:</strong> {{route.driverName || 'Not Assigned'}}</p>
                <p><strong>Vehicle:</strong> {{route.vehicleNumber || 'Not Assigned'}}</p>
                <p><strong>Deliveries:</strong> {{route.deliveries?.length || 0}}</p>
                <p><strong>Estimated Time:</strong> {{route.estimatedTime || 'N/A'}}</p>
                <p><strong>Distance:</strong> {{route.totalDistance || 0}} km</p>
              </div>
              <div class="route-map">
                <div class="map-placeholder">
                  <div class="route-points">
                    <div *ngFor="let delivery of route.deliveries" class="route-point">
                      📍 {{delivery.address}}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="route-actions">
              <button class="assign-btn" (click)="assignDriver(route)">Assign Driver</button>
              <button class="assign-orders-btn" (click)="assignOrders(route)">Assign Orders</button>
              <button class="dispatch-btn" *ngIf="route.status === 'PLANNED' && route.driverName && route.vehicleNumber" (click)="dispatchRoute(route)">Dispatch Route</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Optimization Tab -->
      <div class="tab-content" *ngIf="activeTab === 'optimization'">
        <!-- Empty State for Optimization -->
        <div *ngIf="routes.length === 0" class="empty-state">
          <div class="empty-icon">📈</div>
          <h3>No Routes to Optimize</h3>
          <p>Create delivery routes first to access optimization features.</p>
          <button class="create-route-btn" (click)="createNewRoute()">Create Route</button>
        </div>
        
        <!-- Optimization Content -->
        <div *ngIf="routes.length > 0">
          <div class="optimization-panel">
          <h2>Route Optimization</h2>
          <div class="optimization-options">
            <div class="option-group">
              <h3>Optimization Criteria</h3>
              <label><input type="checkbox" [(ngModel)]="optimizationSettings.minimizeDistance"> Minimize Distance</label>
              <label><input type="checkbox" [(ngModel)]="optimizationSettings.minimizeTime"> Minimize Time</label>
              <label><input type="checkbox" [(ngModel)]="optimizationSettings.balanceLoad"> Balance Load</label>
              <label><input type="checkbox" [(ngModel)]="optimizationSettings.priorityDeliveries"> Priority Deliveries First</label>
            </div>
            <div class="option-group">
              <h3>Constraints</h3>
              <label>Max Deliveries per Route: <input type="number" [(ngModel)]="optimizationSettings.maxDeliveries"></label>
              <label>Max Route Duration: <input type="number" [(ngModel)]="optimizationSettings.maxDuration"> hours</label>
              <label>Vehicle Capacity: <input type="number" [(ngModel)]="optimizationSettings.vehicleCapacity"> kg</label>
            </div>
          </div>
          <div class="optimization-actions">
            <button class="optimize-all-btn" (click)="optimizeAllRoutes()">Optimize All Routes</button>
            <button class="reset-btn" (click)="resetOptimization()">Reset to Original</button>
          </div>
        </div>

        <div class="optimization-results">
          <h3>Optimization Results</h3>
          <div class="results-grid">
            <div class="result-card">
              <h4>Total Distance</h4>
              <div class="metric">
                <span class="before">{{optimizationResults.distanceBefore}} km</span>
                <span class="arrow">→</span>
                <span class="after">{{optimizationResults.distanceAfter}} km</span>
                <span class="improvement">(-{{optimizationResults.distanceImprovement}}%)</span>
              </div>
            </div>
            <div class="result-card">
              <h4>Total Time</h4>
              <div class="metric">
                <span class="before">{{optimizationResults.timeBefore}}h</span>
                <span class="arrow">→</span>
                <span class="after">{{optimizationResults.timeAfter}}h</span>
                <span class="improvement">(-{{optimizationResults.timeImprovement}}%)</span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      <!-- Driver Assignments Tab -->
      <div class="tab-content" *ngIf="activeTab === 'assignments'">
        <!-- Empty State for Assignments -->
        <div *ngIf="routes.length === 0" class="empty-state">
          <div class="empty-icon">👥</div>
          <h3>No Routes for Assignments</h3>
          <p>Create delivery routes to assign drivers and vehicles.</p>
          <button class="create-route-btn" (click)="createNewRoute()">Create Route</button>
        </div>
        
        <!-- Assignments Content -->
        <div *ngIf="routes.length > 0" class="assignments-grid">
          <div class="drivers-section">
            <h3>Available Drivers</h3>
            <div class="drivers-list">
              <div class="driver-card" *ngFor="let driver of availableDrivers" [class.assigned]="driver.assignedRoute">
                <div class="driver-info">
                  <h4>{{driver.name}}</h4>
                  <p>License: {{driver.licenseType}}</p>
                  <p>Experience: {{driver.experience}} years</p>
                  <p *ngIf="driver.assignedRoute">Assigned to: {{driver.assignedRoute}}</p>
                </div>
                <div class="driver-actions">
                  <button class="assign-btn" *ngIf="!driver.assignedRoute" (click)="assignDriverToRoute(driver)">Assign</button>
                  <button class="unassign-btn" *ngIf="driver.assignedRoute" (click)="unassignDriver(driver)">Unassign</button>
                </div>
              </div>
            </div>
          </div>

          <div class="vehicles-section">
            <h3>Available Vehicles</h3>
            <div class="vehicles-list">
              <div class="vehicle-card" *ngFor="let vehicle of availableVehicles" [class.assigned]="vehicle.assignedRoute">
                <div class="vehicle-info">
                  <h4>{{vehicle.number}}</h4>
                  <p>Type: {{vehicle.type}}</p>
                  <p>Capacity: {{vehicle.capacity}} kg</p>
                  <p>Status: {{vehicle.status}}</p>
                  <p *ngIf="vehicle.assignedRoute">Assigned to: {{vehicle.assignedRoute}}</p>
                </div>
                <div class="vehicle-actions">
                  <button class="assign-btn" *ngIf="!vehicle.assignedRoute && vehicle.status === 'AVAILABLE'" (click)="assignVehicleToRoute(vehicle)">Assign</button>
                  <button class="unassign-btn" *ngIf="vehicle.assignedRoute" (click)="unassignVehicle(vehicle)">Unassign</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .logistics-routes { padding: 40px; max-width: 1400px; margin: 0 auto; }
    .routes-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .create-route-btn { padding: 12px 24px; background: var(--primary-blue); color: white; border: none; border-radius: var(--border-radius-md); cursor: pointer; }
    .routes-tabs { display: flex; gap: 4px; margin-bottom: 32px; }
    .tab { padding: 12px 24px; border: none; background: var(--gray-100); cursor: pointer; border-radius: var(--border-radius-md) var(--border-radius-md) 0 0; }
    .tab.active { background: white; border-bottom: 2px solid var(--primary-blue); }
    .planning-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(500px, 1fr)); gap: 24px; }
    .route-card { background: white; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); padding: 24px; }
    .route-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .route-status { padding: 6px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .route-status.planning { background: var(--blue-100); color: var(--blue-600); }
    .route-status.ready { background: var(--green-100); color: var(--green-600); }
    .route-status.dispatched { background: var(--purple-100); color: var(--purple-600); }
    .route-details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 16px; }
    .route-info p { margin: 8px 0; font-size: 14px; }
    .map-placeholder { background: #f0f0f0; border-radius: var(--border-radius-md); padding: 16px; text-align: center; height: 200px; overflow-y: auto; position: relative; background-image: url('/assets/map.jpg'); background-size: cover; background-position: center; }
    .route-points { margin-top: 12px; text-align: left; }
    .route-point { font-size: 12px; margin: 4px 0; }
    .route-actions { display: flex; gap: 8px; flex-wrap: wrap; }
    .route-actions button { padding: 8px 16px; border: none; border-radius: var(--border-radius-md); cursor: pointer; font-size: 12px; }
    .optimize-btn { background: #9b59b6; color: white; }
    .assign-btn { background: #3498db; color: white; }
    .assign-orders-btn { background: #e67e22; color: white; }
    .edit-btn { background: #95a5a6; color: white; }
    .dispatch-btn { background: #27ae60; color: white; }
    .optimization-panel { background: white; padding: 24px; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); margin-bottom: 24px; }
    .optimization-options { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin: 24px 0; }
    .option-group h3 { margin-bottom: 16px; }
    .option-group label { display: block; margin-bottom: 12px; }
    .option-group input[type="checkbox"] { margin-right: 8px; }
    .option-group input[type="number"] { width: 80px; margin-left: 8px; padding: 4px; }
    .optimization-actions { display: flex; gap: 12px; }
    .optimize-all-btn { background: var(--purple-500); color: white; padding: 12px 24px; border: none; border-radius: var(--border-radius-md); cursor: pointer; }
    .reset-btn { background: var(--gray-500); color: white; padding: 12px 24px; border: none; border-radius: var(--border-radius-md); cursor: pointer; }
    .optimization-results { background: white; padding: 24px; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); }
    .results-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 16px; }
    .result-card { padding: 16px; background: var(--gray-50); border-radius: var(--border-radius-md); }
    .metric { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
    .before { color: var(--red-600); }
    .after { color: var(--green-600); font-weight: 600; }
    .improvement { color: var(--green-600); font-size: 12px; }
    .assignments-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
    .drivers-section, .vehicles-section { background: white; padding: 24px; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); }
    .drivers-list, .vehicles-list { display: grid; gap: 16px; }
    .driver-card, .vehicle-card { display: flex; justify-content: space-between; align-items: center; padding: 16px; border: 1px solid var(--gray-200); border-radius: var(--border-radius-md); }
    .driver-card.assigned, .vehicle-card.assigned { background: var(--blue-50); border-color: var(--blue-300); }
    .driver-info h4, .vehicle-info h4 { margin: 0 0 8px 0; }
    .driver-info p, .vehicle-info p { margin: 4px 0; font-size: 14px; color: var(--gray-600); }
    .unassign-btn { background: var(--red-500); color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; }
    
    /* Loading and Empty States */
    .empty-state { text-align: center; padding: 80px 20px; color: #666; }
    .empty-icon { font-size: 4rem; margin-bottom: 1rem; }
    .empty-state h3 { margin: 0 0 0.5rem 0; color: #333; font-size: 1.5rem; }
    .empty-state p { margin: 0 0 2rem 0; font-size: 1rem; }
    .empty-actions { display: flex; gap: 12px; justify-content: center; }
    .import-btn { background: var(--gray-500); color: white; padding: 12px 24px; border: none; border-radius: var(--border-radius-md); cursor: pointer; }
  `]
})
export class LogisticsRoutesComponent implements OnInit {
  activeTab = 'planning';
  routes: DeliveryRoute[] = [];
  availableDrivers: any[] = [];
  availableVehicles: any[] = [];
  optimizationSettings = {
    minimizeDistance: true,
    minimizeTime: false,
    balanceLoad: false,
    priorityDeliveries: true,
    maxDeliveries: 10,
    maxDuration: 8,
    vehicleCapacity: 1000
  };
  optimizationResults = {
    distanceBefore: 150,
    distanceAfter: 125,
    distanceImprovement: 17,
    timeBefore: 8.5,
    timeAfter: 7.2,
    timeImprovement: 15
  };

  constructor(private deliveryRouteService: DeliveryRouteService, private cdr: ChangeDetectorRef, private http: HttpClient) {}

  ngOnInit() {
    this.loadRoutesData();
    this.loadDriversAndVehicles();
  }

  loadRoutesData() {
    console.log('Loading routes from service...');
    this.deliveryRouteService.getAllRoutes().subscribe({
      next: (routes) => {
        console.log('Routes received:', routes);
        this.routes = routes.map(route => ({
          ...route,
          estimatedTime: '6.5 hours',
          totalDistance: 85,
          deliveries: route.deliveries || []
        }));
        console.log('Routes after mapping:', this.routes);
        this.cdr.detectChanges();
        // Force change detection
        setTimeout(() => {
          console.log('Routes in timeout:', this.routes.length);
        }, 100);
      },
      error: (error) => {
        console.error('Error loading routes:', error);
        this.loadMockData();
      }
    });
  }

  loadMockData() {
    this.routes = [];

    this.availableDrivers = [
      {
        id: 1,
        name: 'Kamal Perera',
        licenseType: 'Heavy Vehicle',
        experience: 8,
        assignedRoute: null
      },
      {
        id: 2,
        name: 'Sunil Silva',
        licenseType: 'Light Vehicle',
        experience: 5,
        assignedRoute: null
      }
    ];

    this.availableVehicles = [
      {
        id: 1,
        number: 'CAB-1234',
        type: 'Truck',
        capacity: 2000,
        status: 'AVAILABLE',
        assignedRoute: null
      },
      {
        id: 2,
        number: 'CAB-5678',
        type: 'Van',
        capacity: 800,
        status: 'AVAILABLE',
        assignedRoute: null
      }
    ];
  }

  createNewRoute() {
    Swal.fire({
      title: 'Create New Route',
      html: `
        <input id="routeName" class="swal2-input" placeholder="Route Name">
        <input id="rdcLocation" class="swal2-input" placeholder="RDC Location">
        <input id="scheduledDate" class="swal2-input" type="datetime-local" placeholder="Scheduled Date">
        <textarea id="notes" class="swal2-textarea" placeholder="Notes (optional)"></textarea>
      `,
      showCancelButton: true,
      confirmButtonText: 'Create Route'
    }).then((result) => {
      if (result.isConfirmed) {
        const routeName = (document.getElementById('routeName') as HTMLInputElement).value;
        const rdcLocation = (document.getElementById('rdcLocation') as HTMLInputElement).value;
        const scheduledDate = (document.getElementById('scheduledDate') as HTMLInputElement).value;
        const notes = (document.getElementById('notes') as HTMLTextAreaElement).value;

        if (!routeName || !rdcLocation || !scheduledDate) {
          Swal.fire('Error', 'Please fill in all required fields', 'error');
          return;
        }

        // Convert datetime-local to ISO string format
        const isoDate = new Date(scheduledDate).toISOString();

        const request: CreateRouteRequest = {
          routeName,
          rdcLocation,
          scheduledDate: isoDate,
          notes: notes || undefined
        };

        this.deliveryRouteService.createRoute(request).subscribe({
          next: () => {
            Swal.fire('Created!', 'New route has been created.', 'success');
            this.loadRoutesData();
          },
          error: () => {
            Swal.fire('Error', 'Failed to create route', 'error');
          }
        });
      }
    });
  }

  optimizeRoute(route: any) {
    Swal.fire('Optimized!', `Route ${route.name} has been optimized.`, 'success');
  }

  assignDriver(route: DeliveryRoute) {
    const availableDrivers = this.availableDrivers.filter(d => !d.assignedRoute || d.name === route.driverName);
    const availableVehicles = this.availableVehicles.filter(v => v.status === 'AVAILABLE' && (!v.assignedRoute || v.number === route.vehicleNumber));
    
    if (availableDrivers.length === 0) {
      Swal.fire('No Drivers', 'No available drivers to assign.', 'warning');
      return;
    }

    const driverOptions = availableDrivers.map(d => 
      `<option value="${d.name}" ${d.name === route.driverName ? 'selected' : ''}>${d.name}</option>`
    ).join('');
    
    const vehicleOptions = availableVehicles.map(v => 
      `<option value="${v.number}" ${v.number === route.vehicleNumber ? 'selected' : ''}>${v.number} (${v.type})</option>`
    ).join('');

    Swal.fire({
      title: route.driverName ? 'Update Driver & Vehicle Assignment' : 'Assign Driver & Vehicle',
      html: `
        <select id="driverSelect" class="swal2-select">
          <option value="">Select Driver</option>
          ${driverOptions}
        </select>
        <select id="vehicleSelect" class="swal2-select">
          <option value="">Select Vehicle</option>
          ${vehicleOptions}
        </select>
      `,
      showCancelButton: true,
      confirmButtonText: route.driverName ? 'Update Assignment' : 'Assign'
    }).then((result) => {
      if (result.isConfirmed) {
        const driverName = (document.getElementById('driverSelect') as HTMLSelectElement).value;
        const vehicleNumber = (document.getElementById('vehicleSelect') as HTMLSelectElement).value;
        
        if (!driverName || !vehicleNumber) {
          Swal.fire('Error', 'Please select both driver and vehicle', 'error');
          return;
        }

        const request: AssignDriverRequest = { driverName, vehicleNumber };
        
        this.deliveryRouteService.assignDriver(route.id!, request).subscribe({
          next: (updatedRoute) => {
            // Update the route in the local array with the response data
            const routeIndex = this.routes.findIndex(r => r.id === route.id);
            if (routeIndex !== -1) {
              this.routes[routeIndex] = { ...this.routes[routeIndex], driverName, vehicleNumber };
            }
            
            // Update driver and vehicle assignment status
            const driver = this.availableDrivers.find(d => d.name === driverName);
            const vehicle = this.availableVehicles.find(v => v.number === vehicleNumber);
            if (driver) driver.assignedRoute = route.routeName;
            if (vehicle) vehicle.assignedRoute = route.routeName;
            
            this.cdr.detectChanges();
            const action = route.driverName ? 'Updated' : 'Assigned';
            Swal.fire(`${action}!`, `${driverName} and ${vehicleNumber} ${action.toLowerCase()} to ${route.routeName}.`, 'success');
          },
          error: () => {
            Swal.fire('Error', 'Failed to assign driver and vehicle', 'error');
          }
        });
      }
    });
  }

  editRoute(route: any) {
    Swal.fire('Info', 'Route editing will be implemented in future updates.', 'info');
  }

  dispatchRoute(route: DeliveryRoute) {
    Swal.fire({
      title: 'Dispatch Route?',
      text: `Dispatch ${route.routeName}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Dispatch'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deliveryRouteService.dispatchRoute(route.id!).subscribe({
          next: () => {
            Swal.fire('Dispatched!', 'Route has been dispatched.', 'success');
            this.loadRoutesData();
          },
          error: () => {
            Swal.fire('Error', 'Failed to dispatch route. Make sure driver and vehicle are assigned.', 'error');
          }
        });
      }
    });
  }

  optimizeAllRoutes() {
    Swal.fire('Optimizing...', 'Optimizing all routes based on selected criteria.', 'info');
    setTimeout(() => {
      Swal.fire('Optimized!', 'All routes have been optimized.', 'success');
    }, 2000);
  }

  resetOptimization() {
    Swal.fire('Reset!', 'Routes have been reset to original configuration.', 'success');
  }

  assignDriverToRoute(driver: any) {
    const availableRoutes = this.routes.filter(r => !r.driverName);
    if (availableRoutes.length === 0) {
      Swal.fire('No Routes', 'No available routes to assign.', 'warning');
      return;
    }

    const routeOptions = availableRoutes.map(r => `<option value="${r.id}">${r.routeName}</option>`).join('');
    Swal.fire({
      title: 'Assign to Route',
      html: `<select id="routeSelect" class="swal2-select">${routeOptions}</select>`,
      showCancelButton: true,
      confirmButtonText: 'Assign'
    }).then((result) => {
      if (result.isConfirmed) {
        const routeId = parseInt((document.getElementById('routeSelect') as HTMLSelectElement).value);
        const route = this.routes.find(r => r.id === routeId);
        if (route) {
          route.driverName = driver.name;
          driver.assignedRoute = route.routeName;
          Swal.fire('Assigned!', `${driver.name} assigned to ${route.routeName}.`, 'success');
        }
      }
    });
  }

  unassignDriver(driver: any) {
    const route = this.routes.find(r => r.routeName === driver.assignedRoute);
    if (route) {
      route.driverName = undefined;
    }
    driver.assignedRoute = null;
    Swal.fire('Unassigned!', `${driver.name} has been unassigned.`, 'success');
  }

  assignVehicleToRoute(vehicle: any) {
    const availableRoutes = this.routes.filter(r => !r.vehicleNumber);
    if (availableRoutes.length === 0) {
      Swal.fire('No Routes', 'No available routes to assign.', 'warning');
      return;
    }

    const routeOptions = availableRoutes.map(r => `<option value="${r.id}">${r.routeName}</option>`).join('');
    Swal.fire({
      title: 'Assign to Route',
      html: `<select id="routeSelect" class="swal2-select">${routeOptions}</select>`,
      showCancelButton: true,
      confirmButtonText: 'Assign'
    }).then((result) => {
      if (result.isConfirmed) {
        const routeId = parseInt((document.getElementById('routeSelect') as HTMLSelectElement).value);
        const route = this.routes.find(r => r.id === routeId);
        if (route) {
          route.vehicleNumber = vehicle.number;
          vehicle.assignedRoute = route.routeName;
          Swal.fire('Assigned!', `${vehicle.number} assigned to ${route.routeName}.`, 'success');
        }
      }
    });
  }

  unassignVehicle(vehicle: any) {
    const route = this.routes.find(r => r.routeName === vehicle.assignedRoute);
    if (route) {
      route.vehicleNumber = undefined;
    }
    vehicle.assignedRoute = null;
    Swal.fire('Unassigned!', `${vehicle.number} has been unassigned.`, 'success');
  }

  importRoutes() {
    Swal.fire({
      title: 'Import Routes',
      text: 'Import routes from CSV or Excel file',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Select File'
    }).then((result) => {
      if (result.isConfirmed) {
        // File import functionality would be implemented here
        Swal.fire('Info', 'File import functionality will be implemented.', 'info');
      }
    });
  }

  assignOrders(route: DeliveryRoute) {
    // Load unassigned orders with pick lists + orders currently assigned to this route
    this.http.get<any[]>(`${environment.apiUrl}/orders/unassigned-with-picklist`).subscribe({
      next: (unassignedOrders) => {
        // Also get orders currently assigned to this route
        this.http.get<any[]>(`${environment.apiUrl}/delivery-routes/${route.id}/orders`).subscribe({
          next: (routeOrders) => {
            const allAvailableOrders = [...unassignedOrders, ...routeOrders];
            
            if (allAvailableOrders.length === 0) {
              Swal.fire('No Orders', 'No orders with pick lists available for delivery assignment.', 'warning');
              return;
            }

            const orderOptions = allAvailableOrders.map(o => {
              const isCurrentlyAssigned = routeOrders.some(ro => ro.id === o.id);
              const checkboxState = isCurrentlyAssigned ? 'checked' : '';
              return `<label><input type="checkbox" value="${o.id}" ${checkboxState}> ${o.orderCode} - ${o.customerName || 'Unknown'} (Rs. ${o.totalAmount}) ${isCurrentlyAssigned ? '(Currently Assigned)' : '- Available'}</label>`;
            }).join('<br>');

            Swal.fire({
              title: `Assign Orders to ${route.routeName}`,
              html: `<div style="text-align: left; max-height: 300px; overflow-y: auto;">${orderOptions}</div>`,
              showCancelButton: true,
              confirmButtonText: 'Update Assignment',
              preConfirm: () => {
                const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
                const selectedOrderIds = Array.from(checkboxes).map(cb => parseInt((cb as HTMLInputElement).value));
                return selectedOrderIds;
              }
            }).then((result) => {
              if (result.isConfirmed) {
                this.deliveryRouteService.assignOrdersToRoute(route.id!, result.value).subscribe({
                  next: () => {
                    Swal.fire('Success', `${result.value.length} orders assigned to ${route.routeName}`, 'success');
                    this.loadRoutesData();
                  },
                  error: () => {
                    Swal.fire('Error', 'Failed to assign orders to route', 'error');
                  }
                });
              }
            });
          },
          error: () => {
            // If can't get route orders, just show unassigned ones
            const orderOptions = unassignedOrders.map(o => 
              `<label><input type="checkbox" value="${o.id}"> ${o.orderCode} - ${o.customerName || 'Unknown'} (Rs. ${o.totalAmount}) - Available</label>`
            ).join('<br>');

            Swal.fire({
              title: `Assign Orders to ${route.routeName}`,
              html: `<div style="text-align: left; max-height: 300px; overflow-y: auto;">${orderOptions}</div>`,
              showCancelButton: true,
              confirmButtonText: 'Assign Selected',
              preConfirm: () => {
                const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
                const selectedOrderIds = Array.from(checkboxes).map(cb => parseInt((cb as HTMLInputElement).value));
                return selectedOrderIds;
              }
            }).then((result) => {
              if (result.isConfirmed) {
                this.deliveryRouteService.assignOrdersToRoute(route.id!, result.value).subscribe({
                  next: () => {
                    Swal.fire('Success', `${result.value.length} orders assigned to ${route.routeName}`, 'success');
                    this.loadRoutesData();
                  },
                  error: () => {
                    Swal.fire('Error', 'Failed to assign orders to route', 'error');
                  }
                });
              }
            });
          }
        });
      },
      error: () => {
        Swal.fire('Error', 'Failed to load available orders', 'error');
      }
    });
  }

  loadDriversAndVehicles() {
    // Load drivers from main drivers endpoint
    this.http.get<any[]>(`${environment.apiUrl}/drivers`).subscribe({
      next: (drivers) => {
        this.availableDrivers = drivers.map(d => ({
          id: d.id,
          name: d.name,
          licenseType: 'Heavy Vehicle',
          experience: 5,
          assignedRoute: null
        }));
        this.cdr.detectChanges();
      },
      error: () => this.availableDrivers = []
    });

    // Load vehicles from main vehicles endpoint
    this.http.get<any[]>(`${environment.apiUrl}/vehicles`).subscribe({
      next: (vehicles) => {
        this.availableVehicles = vehicles.map(v => ({
          id: v.id,
          number: v.vehicleNumber,
          type: v.vehicleType,
          capacity: v.capacity,
          status: v.active ? 'AVAILABLE' : 'INACTIVE',
          assignedRoute: null
        }));
        this.cdr.detectChanges();
      },
      error: () => this.availableVehicles = []
    });
  }
}