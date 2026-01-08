import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SkeletonCardComponent } from '../../../shared/components/skeleton-card/skeleton-card.component';
import { MovieCardComponent } from '../../../shared/components/movie-card/movie-card.component';
import { WatchlistService } from '../../../core/services/watchlist.service';
import { Movie, getPosterUrl, getBackdropUrl, getReleaseYear } from '../../../core/interfaces/movie.interface';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    SkeletonCardComponent,
    MovieCardComponent
  ],
  templateUrl: './watchlist.component.html',
  styles: [`
    .watchlist-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(267px, 1fr));
      gap: 1rem;
      justify-items: start;
    }
    
    .movie-card-container {
      position: relative;
      width: 267px;
      cursor: pointer;
      z-index: 1;
      transition: z-index 0s 0.3s;
    }
    
    .movie-card-container:hover {
      z-index: 10;
      transition: z-index 0s;
    }
    
    .movie-card-inner {
      position: relative;
      width: 267px;
      height: 400px;
      border-radius: 0.5rem;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      transform-origin: left center;
    }
    
    .movie-card-container:hover .movie-card-inner {
      width: 475px;
      height: 280px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.7);
    }
    
    .img-portrait {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: opacity 0.4s ease;
    }
    
    .img-landscape {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 0.4s ease;
    }
    
    .movie-card-container:hover .img-portrait {
      opacity: 0;
    }
    
    .movie-card-container:hover .img-landscape {
      opacity: 1;
    }
    
    .details-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1.5rem;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.7) 50%, transparent 100%);
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.4s ease;
    }
    
    .movie-card-container:hover .details-overlay {
      opacity: 1;
      transform: translateY(0);
    }
    
    .btn-action {
      transition: all 0.2s ease;
      transform: scale(0.8);
      opacity: 0;
    }
    
    .movie-card-container:hover .btn-action {
      transform: scale(1);
      opacity: 1;
    }
    
    .movie-card-skeleton {
      width: 267px;
      height: 400px;
    }
    
    @media (max-width: 1200px) {
      .movie-card-container:hover .movie-card-inner {
        width: 400px;
        height: 240px;
      }
    }
    
    @media (max-width: 640px) {
      .watchlist-grid {
        grid-template-columns: 1fr;
        justify-items: center;
      }
      
      .movie-card-container:hover .movie-card-inner {
        width: 320px;
        height: 200px;
      }
    }
  `]
})
export class WatchlistComponent implements OnInit {
  private readonly router = inject(Router);
  readonly watchlistService = inject(WatchlistService);
  
  readonly skeletonCount = Array.from({ length: 8 }, (_, i) => i);
  
  // Computed signals
  readonly isLoading = computed(() => this.watchlistService.isLoading() || this.watchlistService.isEnriching());
  readonly watchlist = computed(() => this.watchlistService.watchlist());
  readonly isEmpty = computed(() => !this.isLoading() && this.watchlist().length === 0);
  
  // Helper functions
  readonly getPosterUrl = getPosterUrl;
  readonly getBackdropUrl = getBackdropUrl;
  readonly getReleaseYear = getReleaseYear;
  
  ngOnInit(): void {
    this.loadWatchlist();
  }
  
  private loadWatchlist(): void {
    this.watchlistService.loadWatchlist().subscribe();
  }
  
  navigateToMovie(tmdbId: number): void {
    this.router.navigate(['/movie', tmdbId]);
  }
  
  removeFromWatchlist(event: Event, tmdbId: number): void {
    event.stopPropagation();
    this.watchlistService.removeFromWatchlist(tmdbId).subscribe();
  }

  onMovieClick(movie: Movie): void {
    // Navigation is handled by movie-card component
  }
}
