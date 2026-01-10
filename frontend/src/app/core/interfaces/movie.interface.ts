/**
 * Movie Interfaces for Neo4flix
 * Based on TMDb API responses via API Gateway
 */

// ===========================================
// MOVIE INTERFACES
// ===========================================

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
  order: number;
}

export interface Movie {
  tmdbId: number;
  title: string;
  originalTitle?: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
  popularity: number;
  genres: string[];
  runtime?: number | null;
  tagline?: string | null;
  trailerUrl?: string | null;
  syncedInNeo4j?: boolean;
  // Cast (top 7 actors from backend)
  cast?: CastMember[];
  // Local ratings from Neo4j
  localAverageRating?: number;
  localRatingCount?: number;
}

export interface MoviePage {
  page: number;
  totalPages: number;
  totalResults: number;
  results: Movie[];
}

export interface MovieLight {
  tmdbId: number;
  title: string;
  posterPath: string | null;
}

export interface SyncResponse {
  tmdbId: number;
  title: string;
  created: boolean;
  message: string;
}

// ===========================================
// GENRE INTERFACES
// ===========================================

export interface Genre {
  id: number;
  name: string;
}

// ===========================================
// RECOMMENDATION INTERFACES
// ===========================================

export interface MovieRecommendation {
  tmdbId: number;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath?: string | null;
  releaseDate?: string;
  voteAverage: number;
  genres: string[];
}

export interface SharedMovie extends MovieRecommendation {
  sharedBy: {
    id: string;
    username: string;
  };
  sharedAt: string;
}

export interface ShareRequest {
  targetUserId: string;
  tmdbId: number;
  message?: string; // Optionnel, max 500 caractères
}

// ===========================================
// USER INTERFACES
// ===========================================

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface UserProfile {
  userId: string;
  username: string;
  email: string;
  watchlistCount: number;
  followersCount: number;
  followingCount: number;
}

export interface FollowStatus {
  following: boolean;
}

// ===========================================
// USER DISCOVERY INTERFACES (NEW)
// ===========================================

export interface UserSuggestion {
  id: string;
  username: string;
  followersCount: number;
  ratingsCount: number;
  watchlistCount: number;
}

export interface UserSuggestionsPage {
  page: number;
  totalPages: number;
  totalResults: number;
  users: UserSuggestion[];
}

// ===========================================
// BATCH REQUEST INTERFACE
// ===========================================

export interface BatchMoviesRequest {
  tmdbIds: number[];
  language?: string;
}

// ===========================================
// WATCHLIST INTERFACES
// ===========================================

export interface WatchlistItem {
  tmdbId: number;
  title: string;
  posterPath: string | null;
  backdropPath?: string | null;
  releaseDate?: string;
  voteAverage?: number;
  genres?: string[];
}

// ===========================================
// RATING INTERFACES
// ===========================================

export interface RateRequest {
  tmdbId: number;
  score: number; // 1-10
  comment?: string; // Optionnel, max 500 caractères
}

export interface RateResponse {
  score: number;
}

/**
 * Individual rating from a user
 */
export interface MovieRating {
  score: number;
  comment: string | null;
  createdAt: string;
}

/**
 * Paginated response for movie ratings
 * Endpoint: GET /api/rates/movie/{tmdbId}
 */
export interface MovieRatingPage {
  tmdbId: number;
  page: number;
  totalPages: number;
  totalResults: number;
  averageScore: number;
  ratings: MovieRating[];
}

// ===========================================
// REVIEW INTERFACES
// ===========================================

export interface Review {
  id?: string;
  author: string;
  content: string;
  rating: number | null;
  createdAt: string;
  isLocal: boolean;
  avatarPath: string | null;
}

export interface ReviewPage {
  reviews: Review[];
  page: number;
  totalPages: number;
  totalResults: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// ===========================================
// UI HELPER INTERFACES
// ===========================================

export interface MovieRowConfig {
  id: string;
  title: string;
  type: 'trending' | 'top-rated' | 'popular' | 'now-playing' | 'upcoming' | 'genre' | 'recommended' | 'similar';
  genreId?: number;
  movieId?: number; // For similar movies
  showRank?: boolean; // For Top 10 style rows
}

// TMDb image base URL helper
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export const TMDB_POSTER_SIZES = {
  small: 'w185',
  medium: 'w342',
  large: 'w500',
  original: 'original'
} as const;

export const TMDB_BACKDROP_SIZES = {
  small: 'w300',
  medium: 'w780',
  large: 'w1280',
  original: 'original'
} as const;

/**
 * Get full poster URL from posterPath
 */
export function getPosterUrl(posterPath: string | null | undefined, size: keyof typeof TMDB_POSTER_SIZES = 'medium'): string {
  if (!posterPath) {
    return '/assets/images/no-poster.png';
  }
  return `${TMDB_IMAGE_BASE}/${TMDB_POSTER_SIZES[size]}${posterPath}`;
}

/**
 * Get full backdrop URL from backdropPath
 */
export function getBackdropUrl(backdropPath: string | null | undefined, size: keyof typeof TMDB_BACKDROP_SIZES = 'large'): string {
  if (!backdropPath) {
    return '/assets/images/no-backdrop.png';
  }
  return `${TMDB_IMAGE_BASE}/${TMDB_BACKDROP_SIZES[size]}${backdropPath}`;
}

/**
 * Extract YouTube video ID from URL
 */
export function getYouTubeVideoId(url: string | null | undefined): string | null {
  if (!url) return null;
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : null;
}

/**
 * Format release year from date string
 */
export function getReleaseYear(releaseDate: string | undefined): string {
  if (!releaseDate) return '';
  return releaseDate.substring(0, 4);
}

/**
 * Format vote average to display format
 */
export function formatVoteAverage(voteAverage: number): string {
  return voteAverage.toFixed(1);
}
