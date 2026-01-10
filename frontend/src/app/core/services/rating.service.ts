import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RateRequest, RateResponse, MovieRatingPage } from '../interfaces/movie.interface';

/**
 * RatingService - Handles movie rating API calls
 * All endpoints require authentication
 */
@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/rates`;

  /**
   * Rate a movie (creates or updates rating)
   * @param request The rating request with tmdbId, score (1-10), and optional comment
   */
  rateMovie(request: RateRequest): Observable<RateResponse> {
    return this.http.post<RateResponse>(this.apiUrl, request)
      .pipe(
        catchError(error => {
          console.error('Failed to rate movie:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Get ratings for a specific movie (paginated)
   * Public endpoint - no authentication required
   * @param tmdbId The TMDb ID of the movie
   * @param page Page number (default: 1)
   * @param size Number of ratings per page (default: 10)
   */
  getMovieRatings(tmdbId: number, page: number = 1, size: number = 10): Observable<MovieRatingPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<MovieRatingPage>(`${this.apiUrl}/movie/${tmdbId}`, { params })
      .pipe(
        catchError(error => {
          console.error('Failed to get movie ratings:', error);
          return of({
            tmdbId,
            page: 1,
            totalPages: 0,
            totalResults: 0,
            averageScore: 0,
            ratings: []
          });
        })
      );
  }
}
