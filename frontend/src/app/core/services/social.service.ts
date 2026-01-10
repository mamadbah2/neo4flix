import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, tap, switchMap, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  User, UserProfile, FollowStatus, SharedMovie, ShareRequest,
  UserSuggestionsPage, Movie
} from '../interfaces/movie.interface';

/**
 * SocialService - Handles social features API calls
 * All endpoints require authentication
 */
@Injectable({
  providedIn: 'root'
})
export class SocialService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  
  // Cached data signals
  readonly following = signal<User[]>([]);
  readonly followers = signal<User[]>([]);
  readonly sharedMovies = signal<SharedMovie[]>([]);
  readonly profile = signal<UserProfile | null>(null);

  // ===========================================
  // PROFILE ENDPOINTS
  // ===========================================

  /**
   * Get current user's profile with stats
   */
  getMyProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/api/users/profile`)
      .pipe(
        tap(profile => this.profile.set(profile)),
        catchError(this.handleError<UserProfile>('getMyProfile'))
      );
  }

  /**
   * Get another user's profile
   */
  getUserProfile(userId: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/api/users/profile/${userId}`)
      .pipe(catchError(this.handleError<UserProfile>('getUserProfile')));
  }

  // ===========================================
  // FOLLOW ENDPOINTS
  // ===========================================

  /**
   * Get list of users I'm following
   */
  getFollowing(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/api/users/following`)
      .pipe(
        tap(users => this.following.set(users)),
        catchError(this.handleError<User[]>('getFollowing', []))
      );
  }

  /**
   * Get list of my followers
   */
  getFollowers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/api/users/followers`)
      .pipe(
        tap(users => this.followers.set(users)),
        catchError(this.handleError<User[]>('getFollowers', []))
      );
  }

  /**
   * Check if I'm following a user
   */
  isFollowing(userId: string): Observable<FollowStatus> {
    return this.http.get<FollowStatus>(`${this.apiUrl}/api/users/following/${userId}`)
      .pipe(catchError(this.handleError<FollowStatus>('isFollowing', { following: false })));
  }

  /**
   * Follow a user
   */
  followUser(userId: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/api/users/follow/${userId}`, {})
      .pipe(
        tap(user => {
          this.following.update(current => [...current, user]);
        }),
        catchError(error => {
          console.error('Failed to follow user:', error);
          throw error;
        })
      );
  }

  /**
   * Unfollow a user
   */
  unfollowUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/users/follow/${userId}`)
      .pipe(
        tap(() => {
          this.following.update(current => current.filter(u => u.id !== userId));
        }),
        catchError(error => {
          console.error('Failed to unfollow user:', error);
          throw error;
        })
      );
  }

  // ===========================================
  // SHARED MOVIES ENDPOINTS
  // ===========================================

  /**
   * Get movies shared with me by friends
   * Enriches the data via batch endpoint to get full movie details
   */
  getSharedMovies(): Observable<SharedMovie[]> {
    return this.http.get<SharedMovie[]>(`${this.apiUrl}/api/recommendations/shared`)
      .pipe(
        switchMap(movies => {
          if (!movies || movies.length === 0) {
            this.sharedMovies.set([]);
            return of([]);
          }
          
          // Extract TMDb IDs for batch enrichment
          const tmdbIds = movies.map(m => m.tmdbId);
          
          // Call batch endpoint to get full movie details
          return this.http.post<Movie[]>(
            `${this.apiUrl}/api/movies/batch`,
            { tmdbIds, language: 'fr-FR' }
          ).pipe(
            map(enrichedMovies => {
              // Create a map for quick lookup
              const movieMap = new Map<number, Movie>();
              enrichedMovies.forEach(m => movieMap.set(m.tmdbId, m));
              
              // Merge enriched data with shared movie info
              const enrichedSharedMovies: SharedMovie[] = movies.map(shared => {
                const enriched = movieMap.get(shared.tmdbId);
                if (enriched) {
                  return {
                    ...shared,
                    overview: enriched.overview || shared.overview,
                    posterPath: enriched.posterPath || shared.posterPath,
                    backdropPath: enriched.backdropPath || shared.backdropPath,
                    voteAverage: enriched.voteAverage ?? shared.voteAverage,
                    genres: enriched.genres || shared.genres,
                    releaseDate: enriched.releaseDate || shared.releaseDate
                  };
                }
                return shared;
              });
              
              this.sharedMovies.set(enrichedSharedMovies);
              return enrichedSharedMovies;
            }),
            catchError(() => {
              // If batch fails, return original data
              this.sharedMovies.set(movies);
              return of(movies);
            })
          );
        }),
        catchError(this.handleError<SharedMovie[]>('getSharedMovies', []))
      );
  }

  /**
   * Share a movie with a friend
   */
  shareMovie(request: ShareRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/api/recommendations/share`, request)
      .pipe(
        catchError(error => {
          console.error('Failed to share movie:', error);
          throw error;
        })
      );
  }

  /**
   * Share a movie with multiple friends
   */
  shareMovieWithMultiple(tmdbId: number, targetUserIds: string[]): Observable<void[]> {
    const requests = targetUserIds.map(userId => 
      this.shareMovie({ targetUserId: userId, tmdbId })
    );
    // Execute all share requests in parallel
    return new Observable(subscriber => {
      Promise.all(requests.map(req => req.toPromise()))
        .then(results => {
          subscriber.next(results as void[]);
          subscriber.complete();
        })
        .catch(error => subscriber.error(error));
    });
  }

  // ===========================================
  // USER DISCOVERY ENDPOINTS
  // ===========================================

  /**
   * Discover users to follow (users I'm not following yet)
   */
  discoverUsers(page: number = 1, size: number = 10): Observable<UserSuggestionsPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<UserSuggestionsPage>(`${this.apiUrl}/api/users/discover`, { params })
      .pipe(
        catchError(this.handleError<UserSuggestionsPage>('discoverUsers', {
          page: 1,
          totalPages: 0,
          totalResults: 0,
          users: []
        }))
      );
  }

  // ===========================================
  // ERROR HANDLING
  // ===========================================

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: unknown): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }
}
