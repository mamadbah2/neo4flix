import { Component, Input, OnInit, inject, signal, computed, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { SkeletonCardComponent } from '../skeleton-card/skeleton-card.component';
import { MovieService } from '../../../core/services/movie.service';
import { RecommendationService } from '../../../core/services/recommendation.service';
import { Movie, MovieRowConfig } from '../../../core/interfaces/movie.interface';

/**
 * MovieRowComponent - Horizontal scrollable row of movie cards
 * 
 * Features:
 * - Configurable data source (trending, genre, recommendations, etc.)
 * - Left/right navigation arrows
 * - Skeleton loading state
 * - Auto-hides on error
 * - Optional rank display for Top 10 style
 */
@Component({
  selector: 'app-movie-row',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, SkeletonCardComponent],
  templateUrl: './movie-row.component.html',
  styles: [`
    :host {
      display: block;
    }
    
    .movie-row {
      position: relative;
      padding: 0 0 1rem 0;
    }
    
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    
    .movies-slider {
      scroll-behavior: smooth;
      -webkit-overflow-scrolling: touch;
    }
    
    /* Navigation Arrows */
    .nav-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 50px;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.3s ease, background 0.3s ease;
      z-index: 50;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .row-container:hover .nav-arrow:not(.hidden) {
      opacity: 0.7;
    }
    
    .nav-arrow:hover {
      opacity: 1 !important;
      background: rgba(0, 0, 0, 0.9);
    }
    
    .nav-arrow-left {
      left: 0;
      border-radius: 0 4px 4px 0;
    }
    
    .nav-arrow-right {
      right: 0;
      border-radius: 4px 0 0 4px;
    }
    
    .nav-arrow.hidden {
      display: none;
    }
    
    /* Top 10 specific styles */
    .top10-row .movies-slider {
      padding-left: 60px;
    }
  `]
})
export class MovieRowComponent implements OnInit, AfterViewInit {
  @Input({ required: true }) config!: MovieRowConfig;
  
  @ViewChild('slider') sliderRef!: ElementRef<HTMLDivElement>;

  private readonly movieService = inject(MovieService);
  private readonly recommendationService = inject(RecommendationService);

  // State signals
  readonly movies = signal<Movie[]>([]);
  readonly isLoading = signal(true);
  readonly isHidden = signal(false);
  readonly scrollPosition = signal(0);

  // Skeleton count for loading state
  readonly skeletonCount = Array.from({ length: 8 }, (_, i) => i);

  // Computed for scroll navigation
  readonly canScrollLeft = computed(() => this.scrollPosition() > 0);
  readonly canScrollRight = computed(() => {
    if (!this.sliderRef?.nativeElement) return true;
    const { scrollLeft, scrollWidth, clientWidth } = this.sliderRef.nativeElement;
    return scrollLeft < scrollWidth - clientWidth - 10;
  });

  ngOnInit(): void {
    this.loadMovies();
  }

  ngAfterViewInit(): void {
    // Update scroll position after view init
    setTimeout(() => this.onScroll(), 100);
  }

  /**
   * Load movies based on config type
   */
  private loadMovies(): void {
    this.isLoading.set(true);

    switch (this.config.type) {
      case 'trending':
        this.movieService.getTrending().subscribe(page => this.handleResponse(page?.results));
        break;
        
      case 'top-rated':
        this.movieService.getTopRated().subscribe(page => this.handleResponse(page?.results));
        break;
        
      case 'popular':
        this.movieService.getPopular().subscribe(page => this.handleResponse(page?.results));
        break;
        
      case 'now-playing':
        this.movieService.getNowPlaying().subscribe(page => this.handleResponse(page?.results));
        break;
        
      case 'upcoming':
        this.movieService.getUpcoming().subscribe(page => this.handleResponse(page?.results));
        break;
        
      case 'genre':
        if (this.config.genreId) {
          this.movieService.getByGenre(this.config.genreId).subscribe(page => this.handleResponse(page?.results));
        }
        break;
        
      case 'recommended':
        this.recommendationService.getRecommendations().subscribe(recs => {
          // Map recommendations to Movie interface
          const movies: Movie[] = recs.map(rec => ({
            tmdbId: rec.tmdbId,
            title: rec.title,
            overview: rec.overview,
            posterPath: rec.posterPath,
            backdropPath: rec.backdropPath ?? null,
            releaseDate: rec.releaseDate ?? '',
            voteAverage: rec.voteAverage,
            voteCount: 0,
            popularity: 0,
            genres: rec.genres
          }));
          this.handleResponse(movies);
        });
        break;
        
      case 'similar':
        if (this.config.movieId) {
          this.movieService.getSimilarMovies(this.config.movieId).subscribe(page => this.handleResponse(page?.results));
        }
        break;
        
      default:
        this.isLoading.set(false);
        this.isHidden.set(true);
    }
  }

  /**
   * Handle API response
   */
  private handleResponse(movies: Movie[] | undefined): void {
    this.isLoading.set(false);
    
    if (!movies || movies.length === 0) {
      this.isHidden.set(true);
      return;
    }
    
    this.movies.set(movies);
  }

  /**
   * Handle scroll event to update navigation arrows
   */
  onScroll(): void {
    if (this.sliderRef?.nativeElement) {
      this.scrollPosition.set(this.sliderRef.nativeElement.scrollLeft);
    }
  }

  /**
   * Scroll left by card width
   */
  scrollLeft(): void {
    if (this.sliderRef?.nativeElement) {
      const scrollAmount = this.config.showRank ? 367 * 3 : 267 * 3;
      this.sliderRef.nativeElement.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  }

  /**
   * Scroll right by card width
   */
  scrollRight(): void {
    if (this.sliderRef?.nativeElement) {
      const scrollAmount = this.config.showRank ? 367 * 3 : 267 * 3;
      this.sliderRef.nativeElement.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }
}
