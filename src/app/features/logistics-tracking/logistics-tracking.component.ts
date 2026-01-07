import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-logistics-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="logistics-tracking fade-in">
      <div class="tracking-header">
        <h1>GPS Tracking & Monitoring</h1>
        <div class="tracking-controls">
          <button class="refresh-btn" (click)="refreshTracking()">🔄 Refresh</button>
          <button class="fullscreen-btn" (click)="toggleFullscreen()">🔍 Fullscreen</button>
        </div>
      </div>

      <div class="tracking-dashboard">
        <div class="map-section">
          <div class="map-container">
            <div class="map-placeholder">
              <h3>🗺️ Live GPS Tracking Map</h3>
              <div class="map-content">
                <div class="vehicle-markers">
                  <div class="vehicle-marker" *ngFor="let vehicle of activeVehicles" 
                       [style.left.%]="vehicle.mapX" [style.top.%]="vehicle.mapY"
                       (click)="selectVehicle(vehicle)">
                    <div class="marker-icon" [class]="'status-' + vehicle.status.toLowerCase()">🚚</div>
                    <div class="marker-label">{{vehicle.number}}</div>
                  </div>
                </div>
                <div class="route-lines">
                  <svg class="route-svg" viewBox="0 0 100 100">
                    <path d="M10,20 Q30,10 50,20 T90,30" stroke="#3b82f6" stroke-width="0.5" fill="none" stroke-dasharray="2,2"/>
                    <path d="M15,40 Q35,30 55,40 T85,50" stroke="#10b981" stroke-width="0.5" fill="none" stroke-dasharray="2,2"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div class="map-controls">
            <button class="control-btn" (click)="zoomIn()">🔍+</button>
            <button class="control-btn" (click)="zoomOut()">🔍-</button>
            <button class="control-btn" (click)="centerMap()">🎯</button>
            <button class="control-btn" (click)="toggleTraffic()">🚦</button>
          </div>
        </div>

        <div class="tracking-sidebar">
          <div class="vehicle-list">
            <h3>Active Vehicles ({{activeVehicles.length}})</h3>
            <div class="vehicle-item" *ngFor="let vehicle of activeVehicles" 
                 [class.selected]="selectedVehicle?.id === vehicle.id"
                 (click)="selectVehicle(vehicle)">
              <div class="vehicle-info">
                <h4>{{vehicle.number}}</h4>
                <p>{{vehicle.driver}}</p>
                <p class="route">{{vehicle.route}}</p>
              </div>
              <div class="vehicle-status">
                <span class="status-dot" [class]="'status-' + vehicle.status.toLowerCase()"></span>
                <span class="status-text">{{vehicle.status}}</span>
                <div class="speed">{{vehicle.speed}} km/h</div>
              </div>
            </div>
          </div>

          <div class="selected-vehicle" *ngIf="selectedVehicle">
            <h3>Vehicle Details</h3>
            <div class="vehicle-details">
              <div class="detail-row">
                <span class="label">Vehicle:</span>
                <span class="value">{{selectedVehicle.number}}</span>
              </div>
              <div class="detail-row">
                <span class="label">Driver:</span>
                <span class="value">{{selectedVehicle.driver}}</span>
              </div>
              <div class="detail-row">
                <span class="label">Route:</span>
                <span class="value">{{selectedVehicle.route}}</span>
              </div>
              <div class="detail-row">
                <span class="label">Current Speed:</span>
                <span class="value">{{selectedVehicle.speed}} km/h</span>
              </div>
              <div class="detail-row">
                <span class="label">Location:</span>
                <span class="value">{{selectedVehicle.currentLocation}}</span>
              </div>
              <div class="detail-row">
                <span class="label">Last Update:</span>
                <span class="value">{{formatTime(selectedVehicle.lastUpdate)}}</span>
              </div>
              <div class="detail-row">
                <span class="label">Distance Traveled:</span>
                <span class="value">{{selectedVehicle.distanceTraveled}} km</span>
              </div>
              <div class="detail-row">
                <span class="label">ETA:</span>
                <span class="value">{{selectedVehicle.eta}}</span>
              </div>
            </div>

            <div class="vehicle-actions">
              <button class="contact-btn" (click)="contactDriver(selectedVehicle)">📞 Contact Driver</button>
              <button class="alert-btn" (click)="sendAlert(selectedVehicle)">⚠️ Send Alert</button>
            </div>
          </div>

          <div class="tracking-alerts">
            <h3>Live Alerts</h3>
            <div class="alert-item" *ngFor="let alert of trackingAlerts" [class]="alert.type">
              <div class="alert-icon">{{getAlertIcon(alert.type)}}</div>
              <div class="alert-content">
                <h4>{{alert.title}}</h4>
                <p>{{alert.message}}</p>
                <span class="alert-time">{{formatTime(alert.timestamp)}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="tracking-stats">
        <div class="stat-card">
          <h4>Active Vehicles</h4>
          <div class="stat-value">{{stats.activeVehicles}}</div>
        </div>
        <div class="stat-card">
          <h4>On-Time Deliveries</h4>
          <div class="stat-value">{{stats.onTimeDeliveries}}%</div>
        </div>
        <div class="stat-card">
          <h4>Average Speed</h4>
          <div class="stat-value">{{stats.averageSpeed}} km/h</div>
        </div>
        <div class="stat-card">
          <h4>Total Distance</h4>
          <div class="stat-value">{{stats.totalDistance}} km</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .logistics-tracking { padding: 40px; max-width: 1600px; margin: 0 auto; }
    .tracking-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .tracking-controls { display: flex; gap: 12px; }
    .refresh-btn, .fullscreen-btn { padding: 8px 16px; background: var(--primary-blue); color: white; border: none; border-radius: var(--border-radius-md); cursor: pointer; }
    .tracking-dashboard { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 32px; }
    .map-section { position: relative; }
    .map-container { background: white; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); overflow: hidden; }
    .map-placeholder { height: 500px; background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); position: relative; display: flex; align-items: center; justify-content: center; flex-direction: column; }
    .map-content { position: relative; width: 100%; height: 100%; }
    .vehicle-markers { position: absolute; width: 100%; height: 100%; }
    .vehicle-marker { position: absolute; cursor: pointer; text-align: center; }
    .marker-icon { font-size: 24px; margin-bottom: 4px; }
    .marker-icon.status-moving { animation: pulse 2s infinite; }
    .marker-label { font-size: 10px; background: rgba(0,0,0,0.7); color: white; padding: 2px 6px; border-radius: 4px; }
    .route-lines { position: absolute; width: 100%; height: 100%; pointer-events: none; }
    .route-svg { width: 100%; height: 100%; }
    .map-controls { position: absolute; top: 16px; right: 16px; display: flex; flex-direction: column; gap: 8px; }
    .control-btn { width: 40px; height: 40px; background: white; border: 1px solid var(--gray-300); border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .tracking-sidebar { display: flex; flex-direction: column; gap: 24px; }
    .vehicle-list, .selected-vehicle, .tracking-alerts { background: white; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); padding: 20px; }
    .vehicle-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid var(--gray-200); cursor: pointer; transition: background 0.2s; }
    .vehicle-item:hover, .vehicle-item.selected { background: var(--blue-50); }
    .vehicle-item:last-child { border-bottom: none; }
    .vehicle-info h4 { margin: 0 0 4px 0; }
    .vehicle-info p { margin: 2px 0; font-size: 14px; color: var(--gray-600); }
    .route { font-weight: 600; color: var(--primary-blue); }
    .vehicle-status { text-align: right; }
    .status-dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; margin-right: 8px; }
    .status-dot.status-moving { background: var(--green-500); }
    .status-dot.status-stopped { background: var(--yellow-500); }
    .status-dot.status-delayed { background: var(--red-500); }
    .status-text { font-size: 12px; color: var(--gray-600); }
    .speed { font-weight: 600; color: var(--primary-blue); margin-top: 4px; }
    .vehicle-details { margin: 16px 0; }
    .detail-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
    .label { font-size: 14px; color: var(--gray-600); }
    .value { font-size: 14px; font-weight: 600; }
    .vehicle-actions { display: flex; gap: 8px; margin-top: 16px; }
    .contact-btn, .alert-btn { flex: 1; padding: 8px 12px; border: none; border-radius: var(--border-radius-md); cursor: pointer; font-size: 12px; }
    .contact-btn { background: var(--green-500); color: white; }
    .alert-btn { background: var(--orange-500); color: white; }
    .tracking-alerts { max-height: 300px; overflow-y: auto; }
    .alert-item { display: flex; gap: 12px; padding: 12px; margin-bottom: 12px; border-radius: var(--border-radius-md); }
    .alert-item.warning { background: var(--yellow-50); }
    .alert-item.error { background: var(--red-50); }
    .alert-item.info { background: var(--blue-50); }
    .alert-icon { font-size: 20px; }
    .alert-content h4 { margin: 0 0 4px 0; font-size: 14px; }
    .alert-content p { margin: 0 0 4px 0; font-size: 12px; }
    .alert-time { font-size: 11px; color: var(--gray-500); }
    .tracking-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
    .stat-card { background: white; padding: 20px; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); text-align: center; }
    .stat-card h4 { margin: 0 0 12px 0; color: var(--gray-600); }
    .stat-value { font-size: 28px; font-weight: 700; color: var(--primary-blue); }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
  `]
})
export class LogisticsTrackingComponent implements OnInit {
  activeVehicles: any[] = [];
  selectedVehicle: any = null;
  trackingAlerts: any[] = [];
  stats = {
    activeVehicles: 5,
    onTimeDeliveries: 94,
    averageSpeed: 45,
    totalDistance: 287
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTrackingData();
    this.startRealTimeUpdates();
  }

  loadTrackingData() {
    // Mock data
    this.activeVehicles = [
      {
        id: 1,
        number: 'CAB-1234',
        driver: 'Kamal Perera',
        route: 'Route A - Central',
        status: 'MOVING',
        speed: 52,
        currentLocation: 'Galle Road, Colombo 03',
        lastUpdate: new Date(),
        distanceTraveled: 45,
        eta: '11:30 AM',
        mapX: 25,
        mapY: 30
      },
      {
        id: 2,
        number: 'CAB-5678',
        driver: 'Sunil Silva',
        route: 'Route B - North',
        status: 'STOPPED',
        speed: 0,
        currentLocation: 'Kandy Road, Colombo 07',
        lastUpdate: new Date(),
        distanceTraveled: 32,
        eta: '12:15 PM',
        mapX: 60,
        mapY: 45
      },
      {
        id: 3,
        number: 'CAB-9012',
        driver: 'Nimal Fernando',
        route: 'Route C - South',
        status: 'DELAYED',
        speed: 35,
        currentLocation: 'Galle Road, Colombo 06',
        lastUpdate: new Date(),
        distanceTraveled: 28,
        eta: '1:45 PM',
        mapX: 40,
        mapY: 65
      }
    ];

    this.trackingAlerts = [
      {
        type: 'warning',
        title: 'Speed Alert',
        message: 'CAB-1234 exceeding speed limit (65 km/h)',
        timestamp: new Date()
      },
      {
        type: 'error',
        title: 'Route Deviation',
        message: 'CAB-9012 has deviated from planned route',
        timestamp: new Date()
      },
      {
        type: 'info',
        title: 'Delivery Complete',
        message: 'CAB-5678 completed delivery at ABC Store',
        timestamp: new Date()
      }
    ];

    // Select first vehicle by default
    if (this.activeVehicles.length > 0) {
      this.selectedVehicle = this.activeVehicles[0];
    }
  }

  startRealTimeUpdates() {
    // Simulate real-time updates every 30 seconds
    setInterval(() => {
      this.updateVehiclePositions();
    }, 30000);
  }

  updateVehiclePositions() {
    this.activeVehicles.forEach(vehicle => {
      if (vehicle.status === 'MOVING') {
        // Simulate movement
        vehicle.mapX += (Math.random() - 0.5) * 5;
        vehicle.mapY += (Math.random() - 0.5) * 5;
        vehicle.speed = Math.floor(Math.random() * 20) + 40;
        vehicle.distanceTraveled += Math.random() * 2;
        vehicle.lastUpdate = new Date();
      }
    });
  }

  selectVehicle(vehicle: any) {
    this.selectedVehicle = vehicle;
  }

  refreshTracking() {
    this.loadTrackingData();
  }

  toggleFullscreen() {
    // Implement fullscreen toggle
    console.log('Toggle fullscreen');
  }

  zoomIn() {
    console.log('Zoom in');
  }

  zoomOut() {
    console.log('Zoom out');
  }

  centerMap() {
    console.log('Center map');
  }

  toggleTraffic() {
    console.log('Toggle traffic');
  }

  contactDriver(vehicle: any) {
    window.open(`tel:+94771234567`);
  }

  sendAlert(vehicle: any) {
    const alertMessage = prompt('Enter alert message:');
    if (alertMessage) {
      this.trackingAlerts.unshift({
        type: 'info',
        title: 'Alert Sent',
        message: `Alert sent to ${vehicle.driver}: ${alertMessage}`,
        timestamp: new Date()
      });
    }
  }

  getAlertIcon(type: string): string {
    switch (type) {
      case 'warning': return '⚠️';
      case 'error': return '🚨';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString();
  }
}