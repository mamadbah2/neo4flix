import { Component, OnInit, OnDestroy, inject, signal, computed, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil, of } from 'rxjs';
import { MovieService } from '../../../core/services/movie.service';
import { Movie, getPosterUrl, getReleaseYear } from '../../../core/interfaces/movie.interface';

/**
 * SearchBarComponent - Expandable search with dropdown results
 * 
 * Features:
 * - Click to expand search input
 * - 300ms debounce on typing
 * - Max 7 results displayed
 * - Keyboard navigation (up/down arrows, enter, escape)
 * - Click outside to close
 */
@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  host: {
    '(document:click)': 'onDocumentClick($event)'
  },
  styles: [`
    :host {
      display: block;
      position: relative;
    }
    
    .search-input-container {
      animation: slideDown 0.2s ease-out;
    }
    
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .search-results {
      animation: fadeIn 0.2s ease-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    .search-result-item img {
      width: 48px;
      height: 72px;
    }
  `]
})
export class SearchBarComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInputRef!: ElementRef<HTMLInputElement>;

  private readonly movieService = inject(MovieService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  // Form control for search input
  readonly searchControl = new FormControl('');

  // State signals
  readonly isOpen = signal(false);
  readonly isSearching = signal(false);
  readonly results = signal<Movie[]>([]);
  readonly selectedIndex = signal(-1);

  // Computed
  readonly showResults = computed(() => 
    this.isOpen() && 
    (this.isSearching() || this.results().length > 0 || (this.searchControl.value?.length ?? 0) >= 2)
  );

  private readonly MAX_RESULTS = 7;

  ngOnInit(): void {
    this.setupSearchSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Setup debounced search subscription
   */
  private setupSearchSubscription(): void {
    this.searchControl.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (!query || query.trim().length < 2) {
          this.results.set([]);
          return of(null);
        }
        
        this.isSearching.set(true);
        this.selectedIndex.set(-1);
        return this.movieService.searchMovies(query, 1);
      })
    ).subscribe(response => {
      this.isSearching.set(false);
      if (response?.results) {
        this.results.set(response.results.slice(0, this.MAX_RESULTS));
      }
    });
  }

  /**
   * Toggle search panel
   */
  toggleSearch(): void {
    this.isOpen.update(v => !v);
    
    if (this.isOpen()) {
      setTimeout(() => {
        this.searchInputRef?.nativeElement?.focus();
      }, 100);
    } else {
      this.clearSearch();
    }
  }

  /**
   * Close search panel
   */
  closeSearch(): void {
    this.isOpen.set(false);
    this.clearSearch();
  }

  /**
   * Clear search input and results
   */
  clearSearch(): void {
    this.searchControl.setValue('');
    this.results.set([]);
    this.selectedIndex.set(-1);
  }

  /**
   * Handle keyboard navigation
   */
  onKeyDown(event: KeyboardEvent): void {
    const resultsLength = this.results().length;
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (resultsLength > 0) {
          this.selectedIndex.update(i => 
            i < resultsLength - 1 ? i + 1 : 0
          );
        }
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        if (resultsLength > 0) {
          this.selectedIndex.update(i => 
            i > 0 ? i - 1 : resultsLength - 1
          );
        }
        break;
        
      case 'Enter':
        event.preventDefault();
        const index = this.selectedIndex();
        if (index >= 0 && index < resultsLength) {
          this.selectMovie(this.results()[index]);
        }
        break;
        
      case 'Escape':
        event.preventDefault();
        this.closeSearch();
        break;
    }
  }

  /**
   * Select a movie and navigate to detail page
   */
  selectMovie(movie: Movie): void {
    this.closeSearch();
    this.router.navigate(['/movie', movie.tmdbId]);
  }

  /**
   * Handle document click to close dropdown
   */
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const hostElement = (this as any).elementRef?.nativeElement;
    
    // Check if click is outside component
    if (hostElement && !hostElement.contains(target)) {
      this.closeSearch();
    }
  }

  // Template helpers
  getPosterUrl = getPosterUrl;
  getReleaseYear = getReleaseYear;
}
