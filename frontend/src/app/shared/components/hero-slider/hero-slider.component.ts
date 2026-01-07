import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MovieService } from '../../../core/services/movie.service';
import { WatchlistService } from '../../../core/services/watchlist.service';
import { Movie, getBackdropUrl } from '../../../core/interfaces/movie.interface';

/**
 * HeroSliderComponent - Featured movies slider for homepage hero
 * 
 * Features:
 * - Auto-advances every 6 seconds
 * - Shows 5 trending movies
 * - Smooth fade transitions
 * - Play button navigates to detail page
 * - Add to watchlist button with optimistic UI
 * - Dot indicators for manual navigation
 */
@Component({
  selector: 'app-hero-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-slider.component.html',
  styles: [`
    :host {
      display: block;
    }
    
    .hero-section {
      min-height: 90vh;
    }
    
    .hero-bg {
      transition: opacity 1.5s ease-in-out;
    }
    
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .slider-dot {
      cursor: pointer;
    }
    
    .slider-dot:hover {
      transform: scale(1.2);
    }
  `]
})
export class HeroSliderComponent implements OnInit, OnDestroy {
  private readonly movieService = inject(MovieService);
  private readonly watchlistService = inject(WatchlistService);
  private readonly router = inject(Router);

  // State signals
  readonly movies = signal<Movie[]>([]);
  readonly currentIndex = signal(0);
  readonly isLoading = signal(true);
  readonly isTransitioning = signal(false);

  // Computed current movie
  readonly currentMovie = computed(() => {
    const allMovies = this.movies();
    const index = this.currentIndex();
    return allMovies.length > 0 ? allMovies[index] : null;
  });

  // Timer for auto-advance
  private slideInterval: ReturnType<typeof setInterval> | null = null;
  private readonly SLIDE_DURATION = 6000; // 6 seconds
  private readonly MAX_SLIDES = 5;

  ngOnInit(): void {
    this.loadTrendingMovies();
    this.watchlistService.loadWatchlist().subscribe();
  }

  ngOnDestroy(): void {
    this.stopAutoAdvance();
  }

  /**
   * Load trending movies for hero
   */
  private loadTrendingMovies(): void {
    this.movieService.getTrending().subscribe(page => {
      if (page?.results?.length > 0) {
        // Take first 5 movies with backdrop
        const moviesWithBackdrop = page.results
          .filter(m => m.backdropPath)
          .slice(0, this.MAX_SLIDES);
        
        this.movies.set(moviesWithBackdrop);
        this.isLoading.set(false);
        this.startAutoAdvance();
      }
    });
  }

  /**
   * Start auto-advance timer
   */
  private startAutoAdvance(): void {
    this.stopAutoAdvance();
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, this.SLIDE_DURATION);
  }

  /**
   * Stop auto-advance timer
   */
  private stopAutoAdvance(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = null;
    }
  }

  /**
   * Advance to next slide with animation
   */
  private nextSlide(): void {
    const totalSlides = this.movies().length;
    if (totalSlides === 0) return;

    this.isTransitioning.set(true);
    
    setTimeout(() => {
      this.currentIndex.update(i => (i + 1) % totalSlides);
      this.isTransitioning.set(false);
    }, 300);
  }

  /**
   * Go to specific slide
   */
  goToSlide(index: number): void {
    if (index === this.currentIndex()) return;
    
    this.isTransitioning.set(true);
    this.stopAutoAdvance();
    
    setTimeout(() => {
      this.currentIndex.set(index);
      this.isTransitioning.set(false);
      this.startAutoAdvance();
    }, 300);
  }

  /**
   * Handle play button click - navigate to movie detail
   */
  onPlayClick(movie: Movie): void {
    this.router.navigate(['/movie', movie.tmdbId]);
  }

  /**
   * Handle watchlist button click
   */
  onWatchlistClick(movie: Movie): void {
    this.watchlistService.toggleWatchlist(movie).subscribe();
  }

  /**
   * Check if movie is in watchlist
   */
  isInWatchlist(tmdbId: number): boolean {
    return this.watchlistService.isInWatchlist(tmdbId);
  }

  /**
   * Get backdrop URL helper
   */
  getBackdropUrl(backdropPath: string | null): string {
    return getBackdropUrl(backdropPath, 'original');
  }
}
