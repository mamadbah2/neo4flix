import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MovieDetailComponent } from './movie-detail.component';

describe('MovieDetailComponent', () => {
  let component: MovieDetailComponent;
  let fixture: ComponentFixture<MovieDetailComponent>;

  const mockActivatedRoute = {
    paramMap: of({
      get: (key: string) => '27205' // Mock movie ID
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieDetailComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MovieDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with loading state', () => {
    expect(component.isLoading()).toBeTrue();
  });

  it('should start with video hidden', () => {
    expect(component.showVideo()).toBeFalse();
  });

  it('should start muted', () => {
    expect(component.isMuted()).toBeTrue();
  });

  it('should format runtime correctly', () => {
    expect(component.formatRuntime(148)).toBe('2h 28min');
    expect(component.formatRuntime(45)).toBe('45min');
  });

  it('should have similar movies config', () => {
    expect(component.similarMoviesConfig.type).toBe('similar');
    expect(component.similarMoviesConfig.title).toBe('Films similaires');
  });
});
