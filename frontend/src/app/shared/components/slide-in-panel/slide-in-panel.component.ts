import { 
  Component, Input, Output, EventEmitter, 
  signal, effect, HostListener, ElementRef, inject 
} from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * SlideInPanelComponent - Reusable slide-in panel from the right
 * 
 * Features:
 * - Slides in from the right side
 * - Close on Escape key
 * - Close on click outside
 * - Customizable title and width
 */
@Component({
  selector: 'app-slide-in-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm animate-fade-in"
        (click)="close()"
        aria-hidden="true">
      </div>
      
      <!-- Panel -->
      <div 
        class="fixed top-0 right-0 h-full z-[151] bg-[#111] border-l border-white/10 shadow-2xl animate-slide-in-right overflow-hidden flex flex-col"
        [style.width]="width"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="'panel-title-' + panelId">
        
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-white/10">
          <h2 
            [id]="'panel-title-' + panelId"
            class="text-xl font-bold text-white">
            {{ title }}
          </h2>
          <button 
            (click)="close()"
            class="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition text-gray-400 hover:text-white"
            aria-label="Fermer le panneau">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>
        
        <!-- Content (scrollable) -->
        <div class="flex-1 overflow-y-auto">
          <ng-content></ng-content>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    .animate-fade-in {
      animation: fadeIn 0.2s ease-out;
    }
    
    .animate-slide-in-right {
      animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
  `]
})
export class SlideInPanelComponent {
  @Input() title = 'Panel';
  @Input() width = '400px';
  @Input() set open(value: boolean) {
    this.isOpen.set(value);
    if (value) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }
  
  @Output() openChange = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();

  readonly isOpen = signal(false);
  readonly panelId = Math.random().toString(36).substring(7);

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen()) {
      this.close();
    }
  }

  close(): void {
    this.isOpen.set(false);
    document.body.style.overflow = 'auto';
    this.openChange.emit(false);
    this.closed.emit();
  }
}
