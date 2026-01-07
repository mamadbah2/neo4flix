import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MovieRowComponent } from './movie-row.component';
import { MovieRowConfig } from '../../../core/interfaces/movie.interface';

describe('MovieRowComponent', () => {
  let component: MovieRowComponent;
  let fixture: ComponentFixture<MovieRowComponent>;

  const mockConfig: MovieRowConfig = {
    id: 'trending',
    title: 'Tendances',
    type: 'trending'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieRowComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MovieRowComponent);
    component = fixture.componentInstance;
    component.config = mockConfig;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display row title', () => {
    const titleElement = fixture.nativeElement.querySelector('h3');
    expect(titleElement?.textContent).toContain('Tendances');
  });

  it('should show skeleton loaders while loading', () => {
    component.isLoading.set(true);
    fixture.detectChanges();
    
    const skeletons = fixture.nativeElement.querySelectorAll('app-skeleton-card');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should hide when no movies', () => {
    component.isHidden.set(true);
    fixture.detectChanges();
    
    const section = fixture.nativeElement.querySelector('.movie-row');
    expect(section).toBeFalsy();
  });

  it('should have navigation arrows', () => {
    const arrows = fixture.nativeElement.querySelectorAll('.nav-arrow');
    expect(arrows.length).toBe(2);
  });
});
