import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WatchlistItem, Movie } from '../interfaces/movie.interface';

/**
 * WatchlistService - Manages user's watchlist
 * All endpoints require authentication
 */
@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/users/watchlist`;

  // Signal-based state
  private readonly _watchlist = signal<WatchlistItem[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _isLoaded = signal<boolean>(false);

  // Public readonly signals
  readonly watchlist = this._watchlist.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
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
   * Load watchlist from API
   */
  loadWatchlist(): Observable<WatchlistItem[]> {
    // Don't reload if already loaded
    if (this._isLoaded()) {
      return of(this._watchlist());
    }

    this._isLoading.set(true);

    return this.http.get<WatchlistItem[]>(this.apiUrl).pipe(
      tap(items => {
        this._watchlist.set(items);
        this._isLoaded.set(true);
        this._isLoading.set(false);
      }),
      catchError(error => {
        console.error('Failed to load watchlist:', error);
        this._isLoading.set(false);
        return of([]);
      })
    );
  }

  /**
   * Force reload watchlist
   */
  refreshWatchlist(): Observable<WatchlistItem[]> {
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
        // Add to local state
        this._watchlist.update(list => [...list, item]);
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
      const optimisticItem: WatchlistItem = {
        tmdbId: movie.tmdbId,
        title: movie.title,
        posterPath: movie.posterPath,
        backdropPath: movie.backdropPath,
        releaseDate: movie.releaseDate,
        voteAverage: movie.voteAverage,
        genres: movie.genres
      };
      this._watchlist.update(list => [...list, optimisticItem]);
    }

    return this.http.post<WatchlistItem>(`${this.apiUrl}/${movie.tmdbId}`, {}).pipe(
      tap(item => {
        // Update with server response
        this._watchlist.update(list => 
          list.map(i => i.tmdbId === item.tmdbId ? item : i)
        );
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
