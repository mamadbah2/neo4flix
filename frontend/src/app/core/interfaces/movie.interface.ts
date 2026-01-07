/**
 * Movie Interfaces for Neo4flix
 * Based on TMDb API responses via API Gateway
 */

// ===========================================
// MOVIE INTERFACES
// ===========================================

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
}

export interface RateResponse {
  score: number;
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
