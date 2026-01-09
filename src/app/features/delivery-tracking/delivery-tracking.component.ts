import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-delivery-tracking',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tracking-container">
      <h1>🚚 Delivery Tracking</h1>
      
      <div *ngIf="trackingInfo" class="tracking-card">
        <div class="order-info">
          <h3>Order #{{trackingInfo.orderId}}</h3>
          <p><strong>Status:</strong> <span class="status-badge" [class]="'status-' + trackingInfo.status.toLowerCase()">{{trackingInfo.status}}</span></p>
          <p><strong>Driver:</strong> {{trackingInfo.driverName}}</p>
          <p><strong>Vehicle:</strong> {{trackingInfo.vehicleNumber}}</p>
          <p><strong>Scheduled:</strong> {{trackingInfo.scheduledDate | date:'short'}}</p>
          <p *ngIf="trackingInfo.actualDeliveryDate"><strong>Delivered:</strong> {{trackingInfo.actualDeliveryDate | date:'short'}}</p>
        </div>

        <div *ngIf="trackingInfo.currentLocation" class="location-info">
          <h4>📍 Current Location</h4>
          <p>{{trackingInfo.currentLocation}}</p>
          <div class="map-placeholder">
            <p>🗺️ Map View (GPS: {{trackingInfo.currentLocation}})</p>
          </div>
        </div>

        <div class="delivery-progress">
          <h4>Delivery Progress</h4>
          <div class="progress-steps">
            <div class="step" [class.active]="isStepActive('SCHEDULED')">
              <span class="step-icon">📋</span>
              <span>Scheduled</span>
            </div>
            <div class="step" [class.active]="isStepActive('IN_TRANSIT')">
              <span class="step-icon">🚚</span>
              <span>In Transit</span>
            </div>
            <div class="step" [class.active]="isStepActive('DELIVERED')">
              <span class="step-icon">✅</span>
              <span>Delivered</span>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!trackingInfo && !loading" class="no-tracking">
        <p>No tracking information available for this order.</p>
      </div>

      <div *ngIf="loading" class="loading">
        <p>Loading tracking information...</p>
      </div>
    </div>
  `,
  styles: [`
    .tracking-container { padding: 20px; max-width: 800px; margin: 0 auto; }
    .tracking-card { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .order-info { margin-bottom: 20px; }
    .status-badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
    .status-scheduled { background: #fff3cd; color: #856404; }
    .status-in_transit { background: #cce5ff; color: #004085; }
    .status-delivered { background: #d4edda; color: #155724; }
    .location-info { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 4px; }
    .map-placeholder { background: #e9ecef; padding: 40px; text-align: center; border-radius: 4px; margin-top: 10px; }
    .progress-steps { display: flex; justify-content: space-between; margin-top: 15px; }
    .step { display: flex; flex-direction: column; align-items: center; opacity: 0.5; }
    .step.active { opacity: 1; color: #28a745; }
    .step-icon { font-size: 24px; margin-bottom: 5px; }
    .no-tracking, .loading { text-align: center; padding: 40px; color: #666; }
  `]
})
export class DeliveryTrackingComponent implements OnInit {
  trackingInfo: any = null;
  loading = true;
  orderId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.orderId = +params['orderId'];
      this.loadTrackingInfo();
    });
  }

  loadTrackingInfo() {
    this.loading = true;
    this.http.get(`${environment.apiUrl}/delivery/track/${this.orderId}`)
      .subscribe({
        next: (data) => {
          this.trackingInfo = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading tracking info:', error);
          this.loading = false;
        }
      });
  }

  isStepActive(step: string): boolean {
    if (!this.trackingInfo) return false;
    
    const steps = ['SCHEDULED', 'IN_TRANSIT', 'DELIVERED'];
    const stepIndex = steps.indexOf(step);
    const currentIndex = steps.indexOf(this.trackingInfo.status);
    
    return stepIndex <= currentIndex;
  }
}