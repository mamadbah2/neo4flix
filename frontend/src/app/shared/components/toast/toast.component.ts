import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../core/services/toast.service';

/**
 * ToastComponent - Displays toast notifications
 * Should be placed in the root app component
 */
@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-6 right-6 z-[1000] flex flex-col gap-3 max-w-sm">
      @for (toast of toastService.toasts(); track toast.id) {
        <div 
          class="toast-item flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl backdrop-blur-md border animate-slide-in"
          [class]="getToastClasses(toast.type)"
          role="alert">
          <i [class]="getToastIcon(toast.type)" class="text-lg"></i>
          <span class="flex-1 text-sm font-medium">{{ toast.message }}</span>
          <button 
            (click)="toastService.dismiss(toast.id)"
            class="text-white/60 hover:text-white transition ml-2"
            aria-label="Fermer">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    .animate-slide-in {
      animation: slideIn 0.3s ease-out;
    }
    
    .toast-success {
      background: rgba(34, 197, 94, 0.9);
      border-color: rgba(34, 197, 94, 0.5);
    }
    
    .toast-error {
      background: rgba(239, 68, 68, 0.9);
      border-color: rgba(239, 68, 68, 0.5);
    }
    
    .toast-info {
      background: rgba(59, 130, 246, 0.9);
      border-color: rgba(59, 130, 246, 0.5);
    }
    
    .toast-warning {
      background: rgba(245, 158, 11, 0.9);
      border-color: rgba(245, 158, 11, 0.5);
    }
  `]
})
export class ToastComponent {
  readonly toastService = inject(ToastService);

  getToastClasses(type: Toast['type']): string {
    return `toast-${type} text-white`;
  }

  getToastIcon(type: Toast['type']): string {
    const icons: Record<Toast['type'], string> = {
      success: 'fa-solid fa-circle-check',
      error: 'fa-solid fa-circle-exclamation',
      info: 'fa-solid fa-circle-info',
      warning: 'fa-solid fa-triangle-exclamation'
    };
    return icons[type];
  }
}
