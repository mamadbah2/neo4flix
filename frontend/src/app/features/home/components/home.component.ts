import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { HeroSliderComponent } from '../../../shared/components/hero-slider/hero-slider.component';
import { MovieRowComponent } from '../../../shared/components/movie-row/movie-row.component';
import { MovieService } from '../../../core/services/movie.service';
import { WatchlistService } from '../../../core/services/watchlist.service';
import { MovieRowConfig } from '../../../core/interfaces/movie.interface';

/**
 * HomeComponent - Main home page with hero and movie rows
 * 
 * Displays:
 * - Hero slider with 5 trending movies
 * - 10+ movie rows (Trending Top 10, Recommended, 7 genres, Top Rated, Popular Top 10)
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    NavbarComponent, 
    HeroSliderComponent, 
    MovieRowComponent
  ],
  templateUrl: './home.component.html',
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HomeComponent implements OnInit {
  private readonly movieService = inject(MovieService);
  private readonly watchlistService = inject(WatchlistService);

  // Static row configurations
  readonly rowConfigs: MovieRowConfig[] = [
    { id: 'trending', title: 'Top 10 des films tendances', type: 'trending', showRank: true },
    { id: 'recommended', title: 'Recommandé pour vous', type: 'recommended' },
    { id: 'top-rated', title: 'Les mieux notés', type: 'top-rated' },
    { id: 'now-playing', title: 'Actuellement à l\'affiche', type: 'now-playing' },
    { id: 'upcoming', title: 'Prochainement', type: 'upcoming' },
    { id: 'popular', title: 'Top 10 populaires', type: 'popular', showRank: true }
  ];

  // Dynamic genre row configurations
  readonly genreRowConfigs = signal<MovieRowConfig[]>([]);

  // Number of genre rows to display
  private readonly MAX_GENRE_ROWS = 7;

  ngOnInit(): void {
    // Load watchlist for optimistic UI
    this.watchlistService.loadWatchlist().subscribe();
    
    // Load genres and create genre rows
    this.loadGenreRows();
  }

  /**
   * Load genres from API and create row configurations
   */
  private loadGenreRows(): void {
    this.movieService.getGenres().subscribe(genres => {
      if (genres && genres.length > 0) {
        // Shuffle genres and take first 7
        const shuffled = this.shuffleArray([...genres]);
        const selectedGenres = shuffled.slice(0, this.MAX_GENRE_ROWS);
        
        // Create row configs for each genre
        const configs: MovieRowConfig[] = selectedGenres.map(genre => ({
          id: `genre-${genre.id}`,
          title: genre.name,
          type: 'genre' as const,
          genreId: genre.id
        }));
        
        this.genreRowConfigs.set(configs);
      }
    });
  }

  /**
   * Shuffle array (Fisher-Yates algorithm)
   */
  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
