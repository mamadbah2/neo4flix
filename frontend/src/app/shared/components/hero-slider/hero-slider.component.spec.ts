import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { HeroSliderComponent } from './hero-slider.component';

describe('HeroSliderComponent', () => {
  let component: HeroSliderComponent;
  let fixture: ComponentFixture<HeroSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSliderComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with loading state', () => {
    expect(component.isLoading()).toBeTrue();
  });

  it('should have currentIndex starting at 0', () => {
    expect(component.currentIndex()).toBe(0);
  });

  it('should navigate to slide when goToSlide is called', fakeAsync(() => {
    component.movies.set([
      { tmdbId: 1, title: 'Movie 1', overview: '', posterPath: '', backdropPath: '/bg1.jpg', releaseDate: '', voteAverage: 8, voteCount: 100, popularity: 50, genres: [] },
      { tmdbId: 2, title: 'Movie 2', overview: '', posterPath: '', backdropPath: '/bg2.jpg', releaseDate: '', voteAverage: 7, voteCount: 80, popularity: 40, genres: [] }
    ]);
    
    component.goToSlide(1);
    tick(400);
    
    expect(component.currentIndex()).toBe(1);
  }));

  it('should have play and watchlist buttons when movie loaded', () => {
    component.movies.set([
      { tmdbId: 1, title: 'Test Movie', overview: 'Test overview', posterPath: '', backdropPath: '/bg.jpg', releaseDate: '', voteAverage: 8, voteCount: 100, popularity: 50, genres: [] }
    ]);
    component.isLoading.set(false);
    fixture.detectChanges();
    
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });
});
