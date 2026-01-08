import { 
  Component, OnInit, OnDestroy, AfterViewInit, 
  inject, signal, computed, 
  ViewChild, ElementRef, PLATFORM_ID, Inject 
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { MovieRowComponent } from '../../../../shared/components/movie-row/movie-row.component';
import { MovieService } from '../../../../core/services/movie.service';
import { WatchlistService } from '../../../../core/services/watchlist.service';
import { RatingService } from '../../../../core/services/rating.service';
import { AuthService } from '../../../../core/services/auth.service';
import { 
  Movie, MovieRowConfig, Review,
  getBackdropUrl, getReleaseYear, getYouTubeVideoId,
  getPosterUrl
} from '../../../../core/interfaces/movie.interface';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

/**
 * MovieDetailComponent - Full movie detail page with trailer background
 * 
 * Features:
 * - Hero with backdrop image
 * - Auto-play YouTube trailer after 3 seconds (if available)
 * - Mute/unmute control
 * - Add to watchlist button
 * - Movie synopsis and details
 * - Cast section with actor avatars
 * - Reviews section with load more
 * - Rating modal for user reviews
 * - Genre-based recommendations
 */
@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent, MovieRowComponent],
  templateUrl: './movie-detail.component.html',
  styles: [`
    :host {
      display: block;
    }
    
    .hero-container {
      min-height: 85vh;
    }
    
    .hero-poster {
      background-size: cover;
      background-position: center;
    }
    
    .video-background {
      pointer-events: none;
    }
    
    .video-background iframe {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100vw;
      height: 56.25vw; /* 16:9 aspect ratio */
      min-height: 100vh;
      min-width: 177.77vh; /* 16:9 aspect ratio */
      transform: translate(-50%, -50%);
    }
    
    .vignette-left {
      background: linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0) 100%);
    }
    
    .vignette-bottom {
      background: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 20%, transparent 50%);
    }
    
    .unmute-btn {
      backdrop-filter: blur(4px);
    }
  `]
})
export class MovieDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('youtubePlayer') youtubePlayerRef!: ElementRef<HTMLDivElement>;

  private readonly route = inject(ActivatedRoute);
  private readonly movieService = inject(MovieService);
  private readonly watchlistService = inject(WatchlistService);
  private readonly ratingService = inject(RatingService);
  readonly authService = inject(AuthService);

  // State signals
  readonly movie = signal<Movie | null>(null);
  readonly isLoading = signal(true);
  readonly showVideo = signal(false);
  readonly isMuted = signal(true);
  
  // Reviews state
  readonly reviews = signal<Review[]>([]);
  readonly reviewsLoading = signal(false);
  readonly reviewsPage = signal(1);
  readonly hasMoreReviews = signal(false);
  
  // Rating modal state
  readonly showReviewModal = signal(false);
  readonly userRating = signal(7);
  readonly userComment = signal('');
  readonly isSubmittingReview = signal(false);

  // Computed values
  readonly videoId = computed(() => getYouTubeVideoId(this.movie()?.trailerUrl));
  readonly backdropUrl = computed(() => getBackdropUrl(this.movie()?.backdropPath, 'original'));
  readonly releaseYear = computed(() => getReleaseYear(this.movie()?.releaseDate));
  
  // Genre-based recommendations config (dynamically set)
  genreRecommendationsConfig: MovieRowConfig | null = null;

  // Similar movies config
  readonly similarMoviesConfig: MovieRowConfig = {
    id: 'similar',
    title: 'Films similaires',
    type: 'similar',
    movieId: 0
  };

  // YouTube player instance
  private player: any = null;
  private playTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    // Load watchlist
    this.watchlistService.loadWatchlist().subscribe();
    
    // Get movie ID from route and load movie
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadMovie(parseInt(id, 10));
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.loadYouTubeAPI();
    }
  }

  ngOnDestroy(): void {
    if (this.playTimeout) {
      clearTimeout(this.playTimeout);
    }
    if (this.player) {
      this.player.destroy();
    }
  }

  /**
   * Load movie details
   */
  private loadMovie(tmdbId: number): void {
    this.isLoading.set(true);
    this.showVideo.set(false);
    this.reviews.set([]);
    this.reviewsPage.set(1);
    
    this.movieService.getMovieDetails(tmdbId).subscribe(movie => {
      this.movie.set(movie);
      this.isLoading.set(false);
      
      if (movie) {
        // Update similar movies config
        this.similarMoviesConfig.movieId = movie.tmdbId;
        
        // Set up genre-based recommendations (use first genre)
        if (movie.genres && movie.genres.length > 0) {
          // We need to get genre IDs - for now we'll use similar movies instead
          // In a real implementation, you'd map genre names to IDs
          this.genreRecommendationsConfig = {
            id: 'genre-reco',
            title: `Plus de films ${movie.genres[0]}`,
            type: 'similar',
            movieId: movie.tmdbId
          };
        }
        
        // Load reviews
        this.loadReviews(tmdbId);
        
        // Schedule video playback if trailer exists
        if (this.videoId() && this.isBrowser) {
          this.scheduleVideoPlayback();
        }
      }
    });
  }
  
  /**
   * Load movie reviews
   */
  private loadReviews(tmdbId: number, append: boolean = false): void {
    this.reviewsLoading.set(true);
    
    this.movieService.getMovieReviews(tmdbId, this.reviewsPage(), 5).subscribe(response => {
      if (append) {
        this.reviews.update(current => [...current, ...response.reviews]);
      } else {
        this.reviews.set(response.reviews);
      }
      this.hasMoreReviews.set(response.hasNext);
      this.reviewsLoading.set(false);
    });
  }
  
  /**
   * Load more reviews
   */
  loadMoreReviews(): void {
    const m = this.movie();
    if (m && this.hasMoreReviews()) {
      this.reviewsPage.update(p => p + 1);
      this.loadReviews(m.tmdbId, true);
    }
  }
  
  /**
   * Open review modal
   */
  openReviewModal(): void {
    this.showReviewModal.set(true);
    document.body.style.overflow = 'hidden';
  }
  
  /**
   * Close review modal
   */
  closeReviewModal(): void {
    this.showReviewModal.set(false);
    document.body.style.overflow = 'auto';
    this.userRating.set(7);
    this.userComment.set('');
  }
  
  /**
   * Submit user review
   */
  submitReview(): void {
    const m = this.movie();
    if (!m) return;
    
    this.isSubmittingReview.set(true);
    
    this.ratingService.rateMovie({
      tmdbId: m.tmdbId,
      score: this.userRating(),
      comment: this.userComment() || undefined
    }).subscribe({
      next: () => {
        this.isSubmittingReview.set(false);
        this.closeReviewModal();
        // Reload reviews to show the new one
        this.reviewsPage.set(1);
        this.loadReviews(m.tmdbId);
      },
      error: () => {
        this.isSubmittingReview.set(false);
      }
    });
  }
  
  /**
   * Get cast member profile image URL
   */
  getCastImageUrl(profilePath: string | null): string {
    return getPosterUrl(profilePath, 'medium');
  }

  /**
   * Load YouTube IFrame API
   */
  private loadYouTubeAPI(): void {
    if (window.YT) {
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
  }

  /**
   * Schedule video playback after 3 seconds
   */
  private scheduleVideoPlayback(): void {
    this.playTimeout = setTimeout(() => {
      this.initYouTubePlayer();
    }, 3000);
  }

  /**
   * Initialize YouTube player
   */
  private initYouTubePlayer(): void {
    const videoId = this.videoId();
    if (!videoId || !this.youtubePlayerRef?.nativeElement) return;

    // Wait for API to be ready
    if (!window.YT?.Player) {
      setTimeout(() => this.initYouTubePlayer(), 500);
      return;
    }

    this.player = new window.YT.Player(this.youtubePlayerRef.nativeElement, {
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        mute: 1,
        controls: 0,
        showinfo: 0,
        rel: 0,
        loop: 1,
        playlist: videoId,
        modestbranding: 1,
        iv_load_policy: 3,
        disablekb: 1,
        fs: 0,
        playsinline: 1
      },
      events: {
        onReady: (event: any) => {
          event.target.playVideo();
          this.showVideo.set(true);
        },
        onError: () => {
          this.showVideo.set(false);
        }
      }
    });
  }

  /**
   * Toggle mute/unmute
   */
  toggleMute(): void {
    if (!this.player) return;
    
    if (this.isMuted()) {
      this.player.unMute();
      this.isMuted.set(false);
    } else {
      this.player.mute();
      this.isMuted.set(true);
    }
  }

  /**
   * Check if movie is in watchlist
   */
  isInWatchlist(): boolean {
    const m = this.movie();
    return m ? this.watchlistService.isInWatchlist(m.tmdbId) : false;
  }

  /**
   * Toggle watchlist
   */
  toggleWatchlist(): void {
    const m = this.movie();
    if (m) {
      this.watchlistService.toggleWatchlist(m).subscribe();
    }
  }

  /**
   * Format runtime to hours and minutes
   */
  formatRuntime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  }

  /**
   * Format date to French locale
   */
  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}
