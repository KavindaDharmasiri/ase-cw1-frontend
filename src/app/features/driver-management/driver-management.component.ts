import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-driver-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="management-container">
      <h1>🚛 Driver & Vehicle Management</h1>
      
      <div class="management-tabs">
        <button class="tab" [class.active]="activeTab === 'drivers'" (click)="activeTab = 'drivers'">Drivers</button>
        <button class="tab" [class.active]="activeTab === 'vehicles'" (click)="activeTab = 'vehicles'">Vehicles</button>
      </div>

      <!-- Drivers Tab -->
      <div *ngIf="activeTab === 'drivers'" class="tab-content">
        <div class="section-header">
          <h2>Drivers</h2>
          <button class="add-btn" (click)="showAddDriverForm = !showAddDriverForm">+ Add Driver</button>
        </div>

        <!-- Add Driver Form -->
        <div *ngIf="showAddDriverForm" class="add-form">
          <h3>Add New Driver</h3>
          <form (ngSubmit)="addDriver()">
            <input [(ngModel)]="newDriver.name" name="name" placeholder="Driver Name" required>
            <input [(ngModel)]="newDriver.licenseNumber" name="license" placeholder="License Number" required>
            <input [(ngModel)]="newDriver.phoneNumber" name="phone" placeholder="Phone Number" required>
            <select [(ngModel)]="newDriver.rdcId" name="rdc" required>
              <option value="">Select RDC</option>
              <option *ngFor="let rdc of rdcs" [value]="rdc.id">{{rdc.name}} - {{rdc.location}}</option>
            </select>
            <select [(ngModel)]="newDriver.status" name="status" required>
              <option value="AVAILABLE">Available</option>
              <option value="BUSY">Busy</option>
              <option value="OFF_DUTY">Off Duty</option>
            </select>
            <div class="form-actions">
              <button type="button" (click)="showAddDriverForm = false">Cancel</button>
              <button type="submit">Add Driver</button>
            </div>
          </form>
        </div>

        <!-- Drivers List -->
        <div class="items-grid">
          <div *ngFor="let driver of drivers" class="item-card">
            <h4>{{driver.name}}</h4>
            <p><strong>License:</strong> {{driver.licenseNumber}}</p>
            <p><strong>Phone:</strong> {{driver.phone}}</p>
            <p><strong>RDC:</strong> {{driver.rdc?.name}} - {{driver.rdc?.location}}</p>
            <p><strong>Status:</strong> <span [class]="'status-' + (driver.active ? 'available' : 'inactive')">{{driver.active ? 'AVAILABLE' : 'INACTIVE'}}</span></p>
            <div class="card-actions">
              <button class="edit-btn" (click)="editDriver(driver)">Edit</button>
              <button class="delete-btn" (click)="deleteDriver(driver.id)">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Vehicles Tab -->
      <div *ngIf="activeTab === 'vehicles'" class="tab-content">
        <div class="section-header">
          <h2>Vehicles</h2>
          <button class="add-btn" (click)="showAddVehicleForm = !showAddVehicleForm">+ Add Vehicle</button>
        </div>

        <!-- Add Vehicle Form -->
        <div *ngIf="showAddVehicleForm" class="add-form">
          <h3>Add New Vehicle</h3>
          <form (ngSubmit)="addVehicle()">
            <input [(ngModel)]="newVehicle.vehicleNumber" name="number" placeholder="Vehicle Number (e.g., CAB-1234)" required>
            <select [(ngModel)]="newVehicle.vehicleType" name="type" required>
              <option value="Truck">Truck</option>
              <option value="Van">Van</option>
              <option value="Lorry">Lorry</option>
            </select>
            <input [(ngModel)]="newVehicle.capacity" name="capacity" type="number" placeholder="Capacity (kg)" required>
            <select [(ngModel)]="newVehicle.rdcId" name="rdc" required>
              <option value="">Select RDC</option>
              <option *ngFor="let rdc of rdcs" [value]="rdc.id">{{rdc.name}} - {{rdc.location}}</option>
            </select>
            <select [(ngModel)]="newVehicle.status" name="status" required>
              <option value="AVAILABLE">Available</option>
              <option value="IN_USE">In Use</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
            <div class="form-actions">
              <button type="button" (click)="showAddVehicleForm = false">Cancel</button>
              <button type="submit">Add Vehicle</button>
            </div>
          </form>
        </div>

        <!-- Vehicles List -->
        <div class="items-grid">
          <div *ngFor="let vehicle of vehicles" class="item-card">
            <h4>{{vehicle.vehicleNumber}}</h4>
            <p><strong>Type:</strong> {{vehicle.vehicleType}}</p>
            <p><strong>Capacity:</strong> {{vehicle.capacity}} kg</p>
            <p><strong>RDC:</strong> {{vehicle.rdc?.name}} - {{vehicle.rdc?.location}}</p>
            <p><strong>Status:</strong> <span [class]="'status-' + (vehicle.active ? 'available' : 'inactive')">{{vehicle.active ? 'AVAILABLE' : 'INACTIVE'}}</span></p>
            <div class="card-actions">
              <button class="edit-btn" (click)="editVehicle(vehicle)">Edit</button>
              <button class="delete-btn" (click)="deleteVehicle(vehicle.id)">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .management-container { padding: 20px; max-width: 1200px; margin: 0 auto; }
    .management-tabs { display: flex; gap: 4px; margin-bottom: 20px; }
    .tab { padding: 12px 24px; border: none; background: #f5f5f5; cursor: pointer; border-radius: 8px 8px 0 0; }
    .tab.active { background: white; border-bottom: 2px solid #3498db; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .add-btn { padding: 10px 20px; background: #27ae60; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .add-form { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .add-form form { display: grid; gap: 15px; max-width: 500px; }
    .add-form input, .add-form select { padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
    .form-actions { display: flex; gap: 10px; }
    .form-actions button { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
    .form-actions button[type="submit"] { background: #3498db; color: white; }
    .form-actions button[type="button"] { background: #95a5a6; color: white; }
    .items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
    .item-card { background: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px; }
    .item-card h4 { margin: 0 0 10px 0; color: #2c3e50; }
    .item-card p { margin: 5px 0; }
    .status-available { color: #27ae60; font-weight: bold; }
    .status-busy, .status-in_use { color: #e67e22; font-weight: bold; }
    .status-off_duty, .status-maintenance, .status-inactive { color: #e74c3c; font-weight: bold; }
    .card-actions { display: flex; gap: 8px; margin-top: 15px; }
    .edit-btn { padding: 6px 12px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; }
    .delete-btn { padding: 6px 12px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; }
  `]
})
export class DriverManagementComponent implements OnInit {
  activeTab = 'drivers';
  drivers: any[] = [];
  vehicles: any[] = [];
  rdcs: any[] = [];
  showAddDriverForm = false;
  showAddVehicleForm = false;
  editingDriver: any = null;
  editingVehicle: any = null;

  newDriver = {
    name: '',
    licenseNumber: '',
    phoneNumber: '',
    status: 'AVAILABLE',
    rdcId: null
  };

  newVehicle = {
    vehicleNumber: '',
    vehicleType: 'Truck',
    capacity: 0,
    status: 'AVAILABLE',
    rdcId: null
  };

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadDrivers();
    this.loadVehicles();
    this.loadRDCs();
  }

  loadDrivers() {
    this.http.get<any[]>(`${environment.apiUrl}/drivers`).subscribe({
      next: (drivers) => {
        this.drivers = drivers;
        this.cdr.detectChanges();
      },
      error: () => this.drivers = []
    });
  }

  loadVehicles() {
    this.http.get<any[]>(`${environment.apiUrl}/vehicles`).subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
        this.cdr.detectChanges();
      },
      error: () => this.vehicles = []
    });
  }

  loadRDCs() {
    this.http.get<any[]>(`${environment.apiUrl}/rdcs`).subscribe({
      next: (rdcs) => this.rdcs = rdcs,
      error: () => this.rdcs = []
    });
  }

  addDriver() {
    const url = this.editingDriver ? 
      `${environment.apiUrl}/drivers/${this.editingDriver.id}` : 
      `${environment.apiUrl}/drivers`;
    const method = this.editingDriver ? 'put' : 'post';
    
    this.http[method](url, this.newDriver).subscribe({
      next: () => {
        const message = this.editingDriver ? 'Driver updated successfully' : 'Driver added successfully';
        Swal.fire('Success', message, 'success');
        this.loadDrivers();
        this.showAddDriverForm = false;
        this.resetDriverForm();
      },
      error: () => {
        const message = this.editingDriver ? 'Failed to update driver' : 'Failed to add driver';
        Swal.fire('Error', message, 'error');
      }
    });
  }

  addVehicle() {
    const url = this.editingVehicle ? 
      `${environment.apiUrl}/vehicles/${this.editingVehicle.id}` : 
      `${environment.apiUrl}/vehicles`;
    const method = this.editingVehicle ? 'put' : 'post';
    
    this.http[method](url, this.newVehicle).subscribe({
      next: () => {
        const message = this.editingVehicle ? 'Vehicle updated successfully' : 'Vehicle added successfully';
        Swal.fire('Success', message, 'success');
        this.loadVehicles();
        this.showAddVehicleForm = false;
        this.resetVehicleForm();
      },
      error: () => {
        const message = this.editingVehicle ? 'Failed to update vehicle' : 'Failed to add vehicle';
        Swal.fire('Error', message, 'error');
      }
    });
  }

  editDriver(driver: any) {
    this.editingDriver = driver;
    this.newDriver = {
      name: driver.name,
      licenseNumber: driver.licenseNumber,
      phoneNumber: driver.phone,
      status: driver.active ? 'AVAILABLE' : 'INACTIVE',
      rdcId: driver.rdc?.id
    };
    this.showAddDriverForm = true;
  }

  editVehicle(vehicle: any) {
    this.editingVehicle = vehicle;
    this.newVehicle = {
      vehicleNumber: vehicle.vehicleNumber,
      vehicleType: vehicle.vehicleType,
      capacity: vehicle.capacity,
      status: vehicle.active ? 'AVAILABLE' : 'INACTIVE',
      rdcId: vehicle.rdc?.id
    };
    this.showAddVehicleForm = true;
  }

  deleteDriver(id: number) {
    Swal.fire({
      title: 'Delete Driver?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${environment.apiUrl}/drivers/${id}`).subscribe({
          next: () => {
            Swal.fire('Deleted', 'Driver deleted successfully', 'success');
            this.loadDrivers();
          },
          error: () => Swal.fire('Error', 'Failed to delete driver', 'error')
        });
      }
    });
  }

  deleteVehicle(id: number) {
    Swal.fire({
      title: 'Delete Vehicle?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${environment.apiUrl}/vehicles/${id}`).subscribe({
          next: () => {
            Swal.fire('Deleted', 'Vehicle deleted successfully', 'success');
            this.loadVehicles();
          },
          error: () => Swal.fire('Error', 'Failed to delete vehicle', 'error')
        });
      }
    });
  }

  resetDriverForm() {
    this.newDriver = {
      name: '',
      licenseNumber: '',
      phoneNumber: '',
      status: 'AVAILABLE',
      rdcId: null
    };
    this.editingDriver = null;
  }

  resetVehicleForm() {
    this.newVehicle = {
      vehicleNumber: '',
      vehicleType: 'Truck',
      capacity: 0,
      status: 'AVAILABLE',
      rdcId: null
    };
    this.editingVehicle = null;
  }
}