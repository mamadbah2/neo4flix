import { Injectable, signal, computed } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

/**
 * ToastService - Manages toast notifications
 * Uses signals for reactive state management
 */
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);
  private nextId = 0;

  readonly toasts = this._toasts.asReadonly();
  readonly hasToasts = computed(() => this._toasts().length > 0);

  /**
   * Show a success toast
   */
  success(message: string, duration = 3000): void {
    this.show({ message, type: 'success', duration });
  }

  /**
   * Show an error toast
   */
  error(message: string, duration = 5000): void {
    this.show({ message, type: 'error', duration });
  }

  /**
   * Show an info toast
   */
  info(message: string, duration = 3000): void {
    this.show({ message, type: 'info', duration });
  }

  /**
   * Show a warning toast
   */
  warning(message: string, duration = 4000): void {
    this.show({ message, type: 'warning', duration });
  }

  /**
   * Add a toast to the queue
   */
  private show(toast: Omit<Toast, 'id'>): void {
    const id = this.nextId++;
    const newToast: Toast = { ...toast, id };
    
    this._toasts.update(toasts => [...toasts, newToast]);

    // Auto-remove after duration
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => this.dismiss(id), toast.duration);
    }
  }

  /**
   * Dismiss a specific toast
   */
  dismiss(id: number): void {
    this._toasts.update(toasts => toasts.filter(t => t.id !== id));
  }

  /**
   * Clear all toasts
   */
  clear(): void {
    this._toasts.set([]);
  }
}
