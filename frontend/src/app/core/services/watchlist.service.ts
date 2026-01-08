import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, map, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WatchlistItem, Movie, BatchMoviesRequest } from '../interfaces/movie.interface';

/**
 * Minimal watchlist response from backend (just tmdbId)
 */
interface WatchlistResponse {
  tmdbId: number;
}

/**
 * WatchlistService - Manages user's watchlist
 * All endpoints require authentication
 * 
 * Flow:
 * 1. GET /api/users/watchlist returns only tmdbIds
 * 2. POST /api/movies/batch enriches with full movie data
 */
@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/users/watchlist`;
  private readonly moviesApiUrl = `${environment.apiUrl}/api/movies`;

  // Signal-based state
  private readonly _watchlist = signal<Movie[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _isLoaded = signal<boolean>(false);
  private readonly _isEnriching = signal<boolean>(false);

  // Public readonly signals
  readonly watchlist = this._watchlist.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly isEnriching = this._isEnriching.asReadonly();
  readonly count = computed(() => this._watchlist().length);

  /**
   * Check if a movie is in the watchlist
   */
  isInWatchlist(tmdbId: number): boolean {
    return this._watchlist().some(item => item.tmdbId === tmdbId);
  }

  /**
   * Computed signal to check if movie is in watchlist
   */
  isInWatchlistSignal(tmdbId: number) {
    return computed(() => this._watchlist().some(item => item.tmdbId === tmdbId));
  }

  /**
   * Load watchlist from API and enrich with /batch
   */
  loadWatchlist(): Observable<Movie[]> {
    // Don't reload if already loaded
    if (this._isLoaded()) {
      return of(this._watchlist());
    }

    this._isLoading.set(true);

    return this.http.get<WatchlistResponse[]>(this.apiUrl).pipe(
      switchMap(items => {
        if (!items || items.length === 0) {
          this._watchlist.set([]);
          this._isLoaded.set(true);
          this._isLoading.set(false);
          return of([]);
        }

        // Extract tmdbIds
        const tmdbIds = items.map(item => item.tmdbId);
        
        // Enrich with batch endpoint
        this._isEnriching.set(true);
        return this.enrichMovies(tmdbIds);
      }),
      tap(movies => {
        this._watchlist.set(movies);
        this._isLoaded.set(true);
        this._isLoading.set(false);
        this._isEnriching.set(false);
      }),
      catchError(error => {
        console.error('Failed to load watchlist:', error);
        this._isLoading.set(false);
        this._isEnriching.set(false);
        return of([]);
      })
    );
  }

  /**
   * Enrich movie IDs with full movie data via /batch endpoint
   */
  private enrichMovies(tmdbIds: number[]): Observable<Movie[]> {
    if (tmdbIds.length === 0) {
      return of([]);
    }

    const request: BatchMoviesRequest = {
      tmdbIds,
      language: 'fr-FR'
    };

    return this.http.post<Movie[]>(`${this.moviesApiUrl}/batch`, request).pipe(
      catchError(error => {
        console.error('Failed to enrich movies:', error);
        // Return minimal data as fallback
        return of(tmdbIds.map(id => ({
          tmdbId: id,
          title: 'Chargement...',
          overview: '',
          posterPath: null,
          backdropPath: null,
          releaseDate: '',
          voteAverage: 0,
          voteCount: 0,
          popularity: 0,
          genres: []
        })));
      })
    );
  }

  /**
   * Force reload watchlist
   */
  refreshWatchlist(): Observable<Movie[]> {
    this._isLoaded.set(false);
    return this.loadWatchlist();
  }

  /**
   * Add movie to watchlist
   */
  addToWatchlist(tmdbId: number): Observable<WatchlistItem | null> {
    // Optimistic update
    const existingItem = this._watchlist().find(item => item.tmdbId === tmdbId);
    if (existingItem) {
      return of(existingItem);
    }

    return this.http.post<WatchlistItem>(`${this.apiUrl}/${tmdbId}`, {}).pipe(
      tap(item => {
        // Add to local state (minimal data for now, will be enriched on next full load)
        const movieItem: Movie = {
          tmdbId: item.tmdbId,
          title: item.title || 'Film',
          overview: '',
          posterPath: item.posterPath || null,
          backdropPath: item.backdropPath || null,
          releaseDate: item.releaseDate || '',
          voteAverage: item.voteAverage || 0,
          voteCount: 0,
          popularity: 0,
          genres: item.genres || []
        };
        this._watchlist.update(list => [...list, movieItem]);
      }),
      catchError(error => {
        console.error('Failed to add to watchlist:', error);
        return of(null);
      })
    );
  }

  /**
   * Add movie to watchlist with full movie data (for optimistic UI)
   */
  addMovieToWatchlist(movie: Movie): Observable<WatchlistItem | null> {
    // Optimistic update with movie data
    if (!this.isInWatchlist(movie.tmdbId)) {
      this._watchlist.update(list => [...list, movie]);
    }

    return this.http.post<WatchlistItem>(`${this.apiUrl}/${movie.tmdbId}`, {}).pipe(
      tap(() => {
        // Already added optimistically, no need to update again
      }),
      catchError(error => {
        console.error('Failed to add to watchlist:', error);
        // Rollback optimistic update
        this._watchlist.update(list => list.filter(i => i.tmdbId !== movie.tmdbId));
        return of(null);
      })
    );
  }

  /**
   * Remove movie from watchlist
   */
  removeFromWatchlist(tmdbId: number): Observable<boolean> {
    // Store for rollback
    const removedItem = this._watchlist().find(item => item.tmdbId === tmdbId);
    
    // Optimistic update
    this._watchlist.update(list => list.filter(item => item.tmdbId !== tmdbId));

    return this.http.delete(`${this.apiUrl}/${tmdbId}`, { observe: 'response' }).pipe(
      map(() => true),
      catchError(error => {
        console.error('Failed to remove from watchlist:', error);
        // Rollback
        if (removedItem) {
          this._watchlist.update(list => [...list, removedItem]);
        }
        return of(false);
      })
    );
  }

  /**
   * Toggle movie in watchlist
   */
  toggleWatchlist(movie: Movie): Observable<boolean> {
    if (this.isInWatchlist(movie.tmdbId)) {
      return this.removeFromWatchlist(movie.tmdbId);
    } else {
      return this.addMovieToWatchlist(movie).pipe(
        map(result => result !== null)
      );
    }
  }

  /**
   * Clear local state (on logout)
   */
  clear(): void {
    this._watchlist.set([]);
    this._isLoaded.set(false);
  }
}
