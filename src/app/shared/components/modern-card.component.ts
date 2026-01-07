import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modern-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modern-card" [class.clickable]="clickable" [class.elevated]="elevated">
      <div class="card-header" *ngIf="title || subtitle">
        <div class="card-icon" *ngIf="icon">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path [attr.d]="icon"/>
          </svg>
        </div>
        <div class="card-title-section">
          <h3 class="card-title" *ngIf="title">{{ title }}</h3>
          <p class="card-subtitle" *ngIf="subtitle">{{ subtitle }}</p>
        </div>
        <div class="card-actions" *ngIf="showActions">
          <ng-content select="[slot=actions]"></ng-content>
        </div>
      </div>
      
      <div class="card-content">
        <ng-content></ng-content>
      </div>
      
      <div class="card-footer" *ngIf="showFooter">
        <ng-content select="[slot=footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .modern-card {
      background: white;
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-md);
      padding: 24px;
      border: 1px solid var(--gray-200);
      transition: all var(--transition-normal);
      position: relative;
      overflow: hidden;
    }
    
    .modern-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--primary-blue), var(--secondary-green));
      transform: scaleX(0);
      transition: transform var(--transition-normal);
    }
    
    .modern-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-xl);
    }
    
    .modern-card:hover::before {
      transform: scaleX(1);
    }
    
    .modern-card.clickable {
      cursor: pointer;
    }
    
    .modern-card.clickable:active {
      transform: translateY(-2px);
    }
    
    .modern-card.elevated {
      box-shadow: var(--shadow-lg);
    }
    
    .modern-card.elevated:hover {
      box-shadow: var(--shadow-xl);
      transform: translateY(-6px);
    }
    
    .card-header {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 20px;
    }
    
    .card-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--border-radius);
      background: linear-gradient(135deg, var(--primary-blue), var(--secondary-green));
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: var(--shadow-md);
    }
    
    .card-title-section {
      flex: 1;
    }
    
    .card-title {
      margin: 0 0 4px 0;
      font-size: 20px;
      font-weight: 600;
      color: var(--gray-800);
      line-height: 1.3;
    }
    
    .card-subtitle {
      margin: 0;
      font-size: 14px;
      color: var(--gray-600);
      line-height: 1.4;
    }
    
    .card-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    
    .card-content {
      color: var(--gray-700);
      line-height: 1.6;
    }
    
    .card-footer {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid var(--gray-200);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .icon {
      width: 24px;
      height: 24px;
      fill: currentColor;
    }
  `]
})
export class ModernCardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() icon?: string;
  @Input() clickable = false;
  @Input() elevated = false;
  @Input() showActions = false;
  @Input() showFooter = false;
}