import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modern-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="modern-btn"
      [ngClass]="buttonClasses"
      [disabled]="disabled || loading"
      (click)="handleClick($event)"
      [type]="type">
      
      <div class="btn-content" [class.loading]="loading">
        <div class="spinner" *ngIf="loading"></div>
        
        <svg class="icon icon-left" *ngIf="iconLeft && !loading" viewBox="0 0 24 24" fill="currentColor">
          <path [attr.d]="iconLeft"/>
        </svg>
        
        <span class="btn-text" *ngIf="!loading || showTextWhileLoading">
          <ng-content></ng-content>
        </span>
        
        <svg class="icon icon-right" *ngIf="iconRight && !loading" viewBox="0 0 24 24" fill="currentColor">
          <path [attr.d]="iconRight"/>
        </svg>
      </div>
      
      <div class="ripple" *ngIf="ripple"></div>
    </button>
  `,
  styles: [`
    .modern-btn {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 12px 24px;
      border: none;
      border-radius: var(--border-radius);
      font-weight: 600;
      font-size: 14px;
      text-decoration: none;
      cursor: pointer;
      transition: all var(--transition-fast);
      overflow: hidden;
      white-space: nowrap;
      user-select: none;
      outline: none;
      min-height: 44px;
    }
    
    .modern-btn:focus-visible {
      outline: 2px solid var(--primary-blue);
      outline-offset: 2px;
    }
    
    /* Variants */
    .modern-btn.primary {
      background: linear-gradient(135deg, var(--primary-blue), var(--secondary-green));
      color: white;
      box-shadow: var(--shadow-md);
    }
    
    .modern-btn.primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
    
    .modern-btn.secondary {
      background: var(--gray-200);
      color: var(--gray-700);
      border: 1px solid var(--gray-300);
    }
    
    .modern-btn.secondary:hover:not(:disabled) {
      background: var(--gray-300);
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }
    
    .modern-btn.success {
      background: linear-gradient(135deg, var(--secondary-green), var(--secondary-green-light));
      color: white;
      box-shadow: var(--shadow-md);
    }
    
    .modern-btn.success:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
    
    .modern-btn.danger {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
      box-shadow: var(--shadow-md);
    }
    
    .modern-btn.danger:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
    }
    
    .modern-btn.outline {
      background: transparent;
      border: 2px solid var(--primary-blue);
      color: var(--primary-blue);
    }
    
    .modern-btn.outline:hover:not(:disabled) {
      background: var(--primary-blue);
      color: white;
      transform: translateY(-1px);
    }
    
    .modern-btn.ghost {
      background: transparent;
      color: var(--gray-700);
      border: 1px solid transparent;
    }
    
    .modern-btn.ghost:hover:not(:disabled) {
      background: var(--gray-100);
      border-color: var(--gray-200);
    }
    
    /* Sizes */
    .modern-btn.small {
      padding: 8px 16px;
      font-size: 12px;
      min-height: 36px;
    }
    
    .modern-btn.large {
      padding: 16px 32px;
      font-size: 16px;
      min-height: 52px;
    }
    
    .modern-btn.full-width {
      width: 100%;
    }
    
    /* States */
    .modern-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }
    
    .modern-btn:active:not(:disabled) {
      transform: translateY(0);
    }
    
    /* Content */
    .btn-content {
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all var(--transition-fast);
    }
    
    .btn-content.loading {
      opacity: 0.8;
    }
    
    .icon {
      width: 18px;
      height: 18px;
      fill: currentColor;
      transition: transform var(--transition-fast);
    }
    
    .modern-btn.small .icon {
      width: 16px;
      height: 16px;
    }
    
    .modern-btn.large .icon {
      width: 20px;
      height: 20px;
    }
    
    .modern-btn:hover .icon {
      transform: scale(1.1);
    }
    
    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    .modern-btn.small .spinner {
      width: 16px;
      height: 16px;
      border-width: 1.5px;
    }
    
    .modern-btn.large .spinner {
      width: 20px;
      height: 20px;
      border-width: 2.5px;
    }
    
    /* Ripple effect */
    .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    }
    
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class ModernButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost' = 'primary';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() showTextWhileLoading = false;
  @Input() fullWidth = false;
  @Input() iconLeft?: string;
  @Input() iconRight?: string;
  @Input() ripple = true;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  
  @Output() clicked = new EventEmitter<Event>();
  
  get buttonClasses(): any {
    return {
      [this.variant]: true,
      [this.size]: true,
      'full-width': this.fullWidth,
      'loading': this.loading
    };
  }
  
  handleClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}