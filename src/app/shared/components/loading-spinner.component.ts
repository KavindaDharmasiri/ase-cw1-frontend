import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spinner-container" [class]="containerClass">
      <div class="spinner" [ngClass]="spinnerType">
        <ng-container *ngIf="spinnerType === 'dots'">
          <div class="dot" 
               *ngFor="let dot of dots; let i = index; trackBy: trackByIndex"
               [style.animation-delay]="i * 0.16 + 's'">
          </div>
        </ng-container>
        <ng-container *ngIf="spinnerType === 'pulse'">
          <div class="pulse-ring" 
               *ngFor="let ring of rings; let i = index; trackBy: trackByIndex"
               [style.animation-delay]="i * 0.4 + 's'">
          </div>
        </ng-container>
      </div>
      <p class="loading-text" *ngIf="text">{{ text }}</p>
    </div>
  `,
  styles: [`
    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
    }
    
    .spinner-container.fullscreen {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(5px);
      z-index: 9999;
    }
    
    .spinner-container.inline {
      padding: 20px;
    }
    
    /* Default circular spinner */
    .spinner.circular {
      width: 40px;
      height: 40px;
      border: 4px solid var(--gray-200);
      border-top: 4px solid var(--primary-blue);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    .spinner.circular.small {
      width: 24px;
      height: 24px;
      border-width: 3px;
    }
    
    .spinner.circular.large {
      width: 60px;
      height: 60px;
      border-width: 6px;
    }
    
    /* Dots spinner */
    .spinner.dots {
      display: flex;
      gap: 8px;
    }
    
    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--primary-blue);
      animation: bounce 1.4s ease-in-out infinite both;
    }
    
    .dot:nth-child(1) { animation-delay: -0.32s; }
    .dot:nth-child(2) { animation-delay: -0.16s; }
    .dot:nth-child(3) { animation-delay: 0s; }
    
    /* Pulse spinner */
    .spinner.pulse {
      position: relative;
      width: 60px;
      height: 60px;
    }
    
    .pulse-ring {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 3px solid var(--primary-blue);
      border-radius: 50%;
      animation: pulse 2s ease-out infinite;
    }
    
    /* Gradient spinner */
    .spinner.gradient {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: conic-gradient(from 0deg, var(--primary-blue), var(--secondary-green), var(--accent-purple), var(--primary-blue));
      animation: spin 1.5s linear infinite;
      position: relative;
    }
    
    .spinner.gradient::before {
      content: '';
      position: absolute;
      top: 4px;
      left: 4px;
      right: 4px;
      bottom: 4px;
      background: white;
      border-radius: 50%;
    }
    
    .loading-text {
      margin: 0;
      font-size: 14px;
      color: var(--gray-600);
      font-weight: 500;
      text-align: center;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes bounce {
      0%, 80%, 100% {
        transform: scale(0);
        opacity: 0.5;
      }
      40% {
        transform: scale(1);
        opacity: 1;
      }
    }
    
    @keyframes pulse {
      0% {
        transform: scale(0);
        opacity: 1;
      }
      100% {
        transform: scale(1);
        opacity: 0;
      }
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() spinnerType: 'circular' | 'dots' | 'pulse' | 'gradient' = 'circular';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() text?: string;
  @Input() containerClass = 'inline';
  
  dots = [1, 2, 3];
  rings = [1, 2];
  
  trackByIndex(index: number): number {
    return index;
  }
}