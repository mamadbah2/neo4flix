import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';

import { WatchlistComponent } from './watchlist.component';
import { WatchlistService } from '../../../core/services/watchlist.service';
import { WatchlistItem } from '../../../core/interfaces/movie.interface';
import { of } from 'rxjs';

describe('WatchlistComponent', () => {
  let component: WatchlistComponent;
  let fixture: ComponentFixture<WatchlistComponent>;
  let watchlistServiceMock: jasmine.SpyObj<WatchlistService>;
  
  const mockWatchlistItems: WatchlistItem[] = [
    {
      id: 1,
      tmdbId: 12345,
      title: 'Test Movie 1',
      posterPath: '/poster1.jpg',
      backdropPath: '/backdrop1.jpg',
      releaseDate: '2024-01-15',
      voteAverage: 8.5,
      genres: ['Action', 'Sci-Fi'],
      addedAt: new Date().toISOString()
    },
    {
      id: 2,
      tmdbId: 67890,
      title: 'Test Movie 2',
      posterPath: '/poster2.jpg',
      backdropPath: '/backdrop2.jpg',
      releaseDate: '2023-06-20',
      voteAverage: 7.2,
      genres: ['Drama'],
      addedAt: new Date().toISOString()
    }
  ];
  
  beforeEach(async () => {
    watchlistServiceMock = jasmine.createSpyObj('WatchlistService', 
      ['loadWatchlist', 'removeFromWatchlist', 'count', 'watchlist'],
      {
        watchlist: signal(mockWatchlistItems),
        count: signal(mockWatchlistItems.length),
        isLoading: signal(false)
      }
    );
    
    watchlistServiceMock.loadWatchlist.and.returnValue(of(mockWatchlistItems));
    watchlistServiceMock.removeFromWatchlist.and.returnValue(of(undefined));
    
    await TestBed.configureTestingModule({
      imports: [WatchlistComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: WatchlistService, useValue: watchlistServiceMock }
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(WatchlistComponent);
    component = fixture.componentInstance;
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should load watchlist on init', () => {
    fixture.detectChanges();
    expect(watchlistServiceMock.loadWatchlist).toHaveBeenCalled();
  });
  
  it('should have helper functions available', () => {
    expect(component.getPosterUrl).toBeDefined();
    expect(component.getBackdropUrl).toBeDefined();
    expect(component.getReleaseYear).toBeDefined();
  });
  
  it('should navigate to movie details', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.navigateToMovie(12345);
    expect(routerSpy).toHaveBeenCalledWith(['/movie', 12345]);
  });
  
  it('should call removeFromWatchlist', () => {
    component.removeFromWatchlist(12345);
    expect(watchlistServiceMock.removeFromWatchlist).toHaveBeenCalledWith(12345);
  });
  
  it('should display skeleton cards while loading', () => {
    expect(component.skeletonCount.length).toBe(8);
  });
  
  it('should have correct poster URL', () => {
    const url = component.getPosterUrl('/test.jpg');
    expect(url).toContain('/test.jpg');
  });
  
  it('should have correct backdrop URL', () => {
    const url = component.getBackdropUrl('/test.jpg');
    expect(url).toContain('/test.jpg');
  });
  
  it('should extract release year correctly', () => {
    const year = component.getReleaseYear('2024-05-15');
    expect(year).toBe('2024');
  });
});
