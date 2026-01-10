import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MovieRecommendation, MoviePage, Movie, BatchMoviesRequest } from '../interfaces/movie.interface';

/**
 * RecommendationService - Handles personalized movie recommendations
 * All endpoints require authentication
 */
@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/recommendations`;
  private readonly moviesApiUrl = `${environment.apiUrl}/api/movies`;
  private readonly defaultLanguage = 'fr-FR';

  /**
   * Get personalized recommendations for the current user
   * Returns raw recommendations (may have null fields)
   */
  getRawRecommendations(): Observable<MovieRecommendation[]> {
    return this.http.get<MovieRecommendation[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Failed to get recommendations:', error);
        return of([]);
      })
    );
  }

  /**
   * Get personalized recommendations enriched with full movie data
   * Fetches recommendations then enriches via batch endpoint
   */
  getRecommendations(): Observable<Movie[]> {
    return this.getRawRecommendations().pipe(
      switchMap(recommendations => {
        if (recommendations.length === 0) {
          return of([]);
        }

        // Extract tmdbIds from recommendations
        const tmdbIds = recommendations.map(rec => rec.tmdbId);

        // Enrich with full movie data via batch endpoint
        return this.getMoviesBatch(tmdbIds);
      }),
      catchError(error => {
        console.error('Failed to enrich recommendations:', error);
        return of([]);
      })
    );
  }

  /**
   * Get multiple movies by their TMDb IDs in a single request
   * Used to enrich recommendation lists with full movie data
   */
  private getMoviesBatch(tmdbIds: number[]): Observable<Movie[]> {
    if (!tmdbIds || tmdbIds.length === 0) {
      return of([]);
    }

    const request: BatchMoviesRequest = {
      tmdbIds,
      language: this.defaultLanguage
    };

    return this.http.post<Movie[]>(`${this.moviesApiUrl}/batch`, request)
      .pipe(
        catchError(error => {
          console.error('Failed to batch fetch movies:', error);
          return of([]);
        })
      );
  }

  /**
   * Get collaborative filtering recommendations
   * (Based on users with similar taste)
   */
  getCollaborativeRecommendations(): Observable<MoviePage> {
    const params = new HttpParams().set('language', this.defaultLanguage);

    return this.http.get<MoviePage>(`${this.moviesApiUrl}/recommendations/collaborative`, { params }).pipe(
      catchError(error => {
        console.error('Failed to get collaborative recommendations:', error);
        return of({ page: 1, totalPages: 0, totalResults: 0, results: [] });
      })
    );
  }

  /**
   * Get genre-based recommendations
   * (Based on user's preferred genres)
   */
  getGenreBasedRecommendations(): Observable<MoviePage> {
    const params = new HttpParams().set('language', this.defaultLanguage);

    return this.http.get<MoviePage>(`${this.moviesApiUrl}/recommendations/genre-based`, { params }).pipe(
      catchError(error => {
        console.error('Failed to get genre-based recommendations:', error);
        return of({ page: 1, totalPages: 0, totalResults: 0, results: [] });
      })
    );
  }
}
