import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SocialService } from '../../../core/services/social.service';
import { AuthService } from '../../../core/services/auth.service';
import { 
  SharedMovie, 
  getPosterUrl, getBackdropUrl 
} from '../../../core/interfaces/movie.interface';

/**
 * SocialComponent - Social page with friends, shared movies, and activity
 */
@Component({
  selector: 'app-social',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './social.component.html',
  styles: [`
    :host {
      display: block;
    }
    
    .glass-card {
      background: rgba(20, 20, 20, 0.7);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .red-gradient-border {
      background: linear-gradient(to top right, #E50914, #B20710);
      padding: 2px;
      border-radius: 9999px;
    }
    
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class SocialComponent implements OnInit {
  private readonly socialService = inject(SocialService);
  readonly authService = inject(AuthService);
  
  // Loading states
  readonly isLoadingProfile = signal(true);
  readonly isLoadingFriends = signal(true);
  readonly isLoadingShared = signal(true);
  
  // Data signals (from service)
  readonly profile = this.socialService.profile;
  readonly following = this.socialService.following;
  readonly followers = this.socialService.followers;
  readonly sharedMovies = this.socialService.sharedMovies;
  
  // Featured shared movie
  readonly featuredMovie = signal<SharedMovie | null>(null);

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    // Load profile
    this.socialService.getMyProfile().subscribe({
      next: () => this.isLoadingProfile.set(false),
      error: () => this.isLoadingProfile.set(false)
    });
    
    // Load friends (following)
    this.socialService.getFollowing().subscribe({
      next: () => this.isLoadingFriends.set(false),
      error: () => this.isLoadingFriends.set(false)
    });
    
    // Load followers
    this.socialService.getFollowers().subscribe();
    
    // Load shared movies
    this.socialService.getSharedMovies().subscribe({
      next: (movies) => {
        this.isLoadingShared.set(false);
        if (movies.length > 0) {
          this.featuredMovie.set(movies[0]);
        }
      },
      error: () => this.isLoadingShared.set(false)
    });
  }

  getAvatarUrl(seed: string): string {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
  }

  getPosterUrl(path: string | null): string {
    return getPosterUrl(path, 'medium');
  }

  getBackdropUrl(path: string | null): string {
    return getBackdropUrl(path, 'large');
  }

  getInitials(name: string): string {
    return name.substring(0, 2).toUpperCase();
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) {
      return `Il y a ${diffMins} min${diffMins > 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
      return `Il y a ${diffHours}h`;
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }
  }
}
