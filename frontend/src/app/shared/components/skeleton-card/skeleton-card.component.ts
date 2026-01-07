import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * SkeletonCardComponent - Loading placeholder for movie cards
 * Displays animated gray placeholder matching card dimensions
 */
@Component({
  selector: 'app-skeleton-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-card.component.html',
  styles: [`
    :host {
      display: block;
    }
    
    .skeleton-card {
      aspect-ratio: 2/3;
      background: linear-gradient(
        90deg,
        rgba(30, 30, 30, 1) 0%,
        rgba(50, 50, 50, 1) 50%,
        rgba(30, 30, 30, 1) 100%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 0.5rem;
    }
    
    @keyframes shimmer {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
  `]
})
export class SkeletonCardComponent {
  @Input() width = '267px';
  @Input() height = '401px';
}
