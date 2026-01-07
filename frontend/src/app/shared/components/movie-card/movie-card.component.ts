import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Movie, getPosterUrl, getBackdropUrl, getReleaseYear, formatVoteAverage } from '../../../core/interfaces/movie.interface';

/**
 * MovieCardComponent - Reusable movie poster card with hover expansion
 * 
 * Features:
 * - Portrait poster by default
 * - Landscape backdrop on hover with smooth transition
 * - Movie info overlay on hover (title, year, rating, genres)
 * - Optional rank display for Top 10 style rows
 * - Click navigates to movie detail page
 */
@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-card.component.html',
  styles: [`
    :host {
      display: block;
    }
    
    .movie-card-container {
      position: relative;
      width: 267px;
      height: 401px;
      flex-shrink: 0;
      cursor: pointer;
      z-index: 10;
    }
    
    .movie-card-container.show-rank {
      padding-left: 100px;
    }
    
    .movie-card-inner {
      position: absolute;
      top: 0;
      left: 0;
      width: 267px;
      height: 401px;
      transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                  box-shadow 0.3s ease;
      border-radius: 0.5rem;
      overflow: hidden;
      background: #141414;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    
    .movie-card-inner.with-rank {
      left: 100px;
    }
    
    .movie-card-container:hover {
      z-index: 100;
    }
    
    .movie-card-container:hover .movie-card-inner {
      width: 475px;
      box-shadow: 0 25px 60px rgba(0,0,0,1), 0 0 0 2px rgba(229, 9, 20, 0.4);
    }
    
    /* Giant number for Top 10 */
    .giant-number {
      font-size: 18rem;
      line-height: 1;
      -webkit-text-stroke: 4px #444;
      color: #000;
      font-weight: 900;
      position: absolute;
      left: -10px;
      bottom: -40px;
      z-index: 0;
      transition: all 0.4s ease;
      user-select: none;
    }
    
    .movie-card-container:hover .giant-number {
      -webkit-text-stroke: 4px #fff;
      transform: translateX(-15px) scale(1.05);
    }
    
    /* Image styles */
    .img-portrait {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 1;
      transition: opacity 0.4s ease;
    }
    
    .img-landscape {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 0.4s ease;
      position: absolute;
      inset: 0;
    }
    
    .movie-card-container:hover .img-portrait {
      opacity: 0;
    }
    
    .movie-card-container:hover .img-landscape {
      opacity: 1;
    }
    
    /* Details overlay */
    .details-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.2) 60%, transparent 100%);
      opacity: 0;
      transition: opacity 0.4s ease;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 1.5rem;
      pointer-events: none;
    }
    
    .movie-card-container:hover .details-overlay {
      opacity: 1;
      pointer-events: auto;
    }
    
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class MovieCardComponent {
  @Input({ required: true }) movie!: Movie;
  @Input() showRank = false;
  @Input() rank?: number;
  
  @Output() cardClick = new EventEmitter<Movie>();

  constructor(private router: Router) {}

  get posterUrl(): string {
    return getPosterUrl(this.movie.posterPath, 'medium');
  }

  get backdropUrl(): string {
    return getBackdropUrl(this.movie.backdropPath, 'medium');
  }

  get releaseYear(): string {
    return getReleaseYear(this.movie.releaseDate);
  }

  get formattedRating(): string {
    return formatVoteAverage(this.movie.voteAverage);
  }

  onCardClick(): void {
    this.cardClick.emit(this.movie);
    this.router.navigate(['/movie', this.movie.tmdbId]);
  }
}
