import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Movie, MoviePage, Genre, ReviewPage, BatchMoviesRequest } from '../interfaces/movie.interface';

/**
 * MovieService - Handles all movie-related API calls
 * All discovery endpoints are public (no auth required)
 */
@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/movies`;
  private readonly defaultLanguage = 'fr-FR';

  // ===========================================
  // DISCOVERY ENDPOINTS (Public)
  // ===========================================

  /**
   * Get trending movies
   */
  getTrending(page: number = 1): Observable<MoviePage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('language', this.defaultLanguage);

    return this.http.get<MoviePage>(`${this.apiUrl}/discovery/trending`, { params })
      .pipe(catchError(this.handleError<MoviePage>('getTrending')));
  }

  /**
   * Get top rated movies
   */
  getTopRated(page: number = 1): Observable<MoviePage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('language', this.defaultLanguage);

    return this.http.get<MoviePage>(`${this.apiUrl}/discovery/top-rated`, { params })
      .pipe(catchError(this.handleError<MoviePage>('getTopRated')));
  }

  /**
   * Get popular movies
   */
  getPopular(page: number = 1): Observable<MoviePage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('language', this.defaultLanguage);

    return this.http.get<MoviePage>(`${this.apiUrl}/discovery/popular`, { params })
      .pipe(catchError(this.handleError<MoviePage>('getPopular')));
  }

  /**
   * Get now playing movies
   */
  getNowPlaying(page: number = 1): Observable<MoviePage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('language', this.defaultLanguage);

    return this.http.get<MoviePage>(`${this.apiUrl}/discovery/now-playing`, { params })
      .pipe(catchError(this.handleError<MoviePage>('getNowPlaying')));
  }

  /**
   * Get upcoming movies
   */
  getUpcoming(page: number = 1): Observable<MoviePage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('language', this.defaultLanguage);

    return this.http.get<MoviePage>(`${this.apiUrl}/discovery/upcoming`, { params })
      .pipe(catchError(this.handleError<MoviePage>('getUpcoming')));
  }

  /**
   * Get movies by genre
   */
  getByGenre(genreId: number, page: number = 1): Observable<MoviePage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('language', this.defaultLanguage);

    return this.http.get<MoviePage>(`${this.apiUrl}/discovery/by-genre/${genreId}`, { params })
      .pipe(catchError(this.handleError<MoviePage>('getByGenre')));
  }

  // ===========================================
  // GENRE ENDPOINTS
  // ===========================================

  /**
   * Get all available genres
   */
  getGenres(): Observable<Genre[]> {
    const params = new HttpParams().set('language', this.defaultLanguage);

    return this.http.get<Genre[]>(`${this.apiUrl}/genres`, { params })
      .pipe(catchError(this.handleError<Genre[]>('getGenres', [])));
  }

  // ===========================================
  // MOVIE DETAILS
  // ===========================================

  /**
   * Get movie details by TMDb ID
   */
  getMovieDetails(tmdbId: number): Observable<Movie | null> {
    const params = new HttpParams().set('language', this.defaultLanguage);

    return this.http.get<Movie>(`${this.apiUrl}/${tmdbId}`, { params })
      .pipe(catchError(this.handleError<Movie | null>('getMovieDetails', null)));
  }

  /**
   * Get similar movies
   */
  getSimilarMovies(tmdbId: number): Observable<MoviePage> {
    const params = new HttpParams().set('language', this.defaultLanguage);

    return this.http.get<MoviePage>(`${this.apiUrl}/${tmdbId}/similar`, { params })
      .pipe(catchError(this.handleError<MoviePage>('getSimilarMovies')));
  }

  /**
   * Get movie reviews (paginated)
   * Returns local reviews first, then TMDb reviews
   */
  getMovieReviews(tmdbId: number, page: number = 1, size: number = 5): Observable<ReviewPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('language', this.defaultLanguage);

    return this.http.get<ReviewPage>(`${this.apiUrl}/${tmdbId}/reviews`, { params })
      .pipe(catchError(this.handleError<ReviewPage>('getMovieReviews', {
        reviews: [],
        page: 1,
        totalPages: 0,
        totalResults: 0,
        hasNext: false,
        hasPrevious: false
      })));
  }

  // ===========================================
  // SEARCH
  // ===========================================

  /**
   * Search movies by query
   */
  searchMovies(query: string, page: number = 1): Observable<MoviePage> {
    if (!query || query.trim().length === 0) {
      return of({ page: 1, totalPages: 0, totalResults: 0, results: [] });
    }

    const params = new HttpParams()
      .set('query', query.trim())
      .set('page', page.toString())
      .set('language', this.defaultLanguage);

    return this.http.get<MoviePage>(`${this.apiUrl}/search`, { params })
      .pipe(catchError(this.handleError<MoviePage>('searchMovies')));
  }

  // ===========================================
  // BATCH ENDPOINT
  // ===========================================

  /**
   * Get multiple movies by their TMDb IDs in a single request
   * Useful for enriching watchlist or recommendation lists
   * @param tmdbIds Array of TMDb IDs (max 50)
   */
  getMoviesBatch(tmdbIds: number[]): Observable<Movie[]> {
    if (!tmdbIds || tmdbIds.length === 0) {
      return of([]);
    }

    const request: BatchMoviesRequest = {
      tmdbIds,
      language: this.defaultLanguage
    };

    return this.http.post<Movie[]>(`${this.apiUrl}/batch`, request)
      .pipe(catchError(this.handleError<Movie[]>('getMoviesBatch', [])));
  }

  // ===========================================
  // ERROR HANDLING
  // ===========================================

  /**
   * Handle HTTP errors gracefully
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: unknown): Observable<T> => {
      console.error(`${operation} failed:`, error);
      
      // Return empty result to allow app to continue
      return of(result as T);
    };
  }
}
