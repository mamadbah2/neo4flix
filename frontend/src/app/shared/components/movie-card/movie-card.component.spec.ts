import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MovieCardComponent } from './movie-card.component';
import { Movie } from '../../../core/interfaces/movie.interface';

describe('MovieCardComponent', () => {
  let component: MovieCardComponent;
  let fixture: ComponentFixture<MovieCardComponent>;
  let router: jasmine.SpyObj<Router>;

  const mockMovie: Movie = {
    tmdbId: 27205,
    title: 'Inception',
    overview: 'A thief who steals corporate secrets...',
    posterPath: '/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg',
    backdropPath: '/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
    releaseDate: '2010-07-16',
    voteAverage: 8.4,
    voteCount: 35000,
    popularity: 100,
    genres: ['Action', 'Science-Fiction', 'Aventure']
  };

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [MovieCardComponent],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MovieCardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    component.movie = mockMovie;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display movie title in overlay', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.details-overlay h4').textContent).toContain('Inception');
  });

  it('should generate correct poster URL', () => {
    expect(component.posterUrl).toContain('image.tmdb.org');
    expect(component.posterUrl).toContain(mockMovie.posterPath);
  });

  it('should generate correct backdrop URL', () => {
    expect(component.backdropUrl).toContain('image.tmdb.org');
    expect(component.backdropUrl).toContain(mockMovie.backdropPath!);
  });

  it('should extract release year', () => {
    expect(component.releaseYear).toBe('2010');
  });

  it('should format rating correctly', () => {
    expect(component.formattedRating).toBe('8.4');
  });

  it('should navigate to movie detail on click', () => {
    component.onCardClick();
    expect(router.navigate).toHaveBeenCalledWith(['/movie', 27205]);
  });

  it('should show rank when showRank is true', () => {
    component.showRank = true;
    component.rank = 1;
    fixture.detectChanges();
    
    const rankElement = fixture.nativeElement.querySelector('.giant-number');
    expect(rankElement).toBeTruthy();
    expect(rankElement.textContent).toContain('1');
  });

  it('should not show rank by default', () => {
    const rankElement = fixture.nativeElement.querySelector('.giant-number');
    expect(rankElement).toBeFalsy();
  });

  it('should display up to 2 genres', () => {
    const genreElements = fixture.nativeElement.querySelectorAll('.details-overlay span.text-xs');
    expect(genreElements.length).toBeLessThanOrEqual(2);
  });
});
