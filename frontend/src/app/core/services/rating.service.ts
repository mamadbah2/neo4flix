import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RateRequest, RateResponse } from '../interfaces/movie.interface';

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
}
