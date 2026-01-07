import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { SearchBarComponent } from './search-bar.component';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBarComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with search closed', () => {
    expect(component.isOpen()).toBeFalse();
  });

  it('should toggle search on button click', () => {
    component.toggleSearch();
    expect(component.isOpen()).toBeTrue();
    
    component.toggleSearch();
    expect(component.isOpen()).toBeFalse();
  });

  it('should clear search on close', () => {
    component.searchControl.setValue('test');
    component.closeSearch();
    
    expect(component.searchControl.value).toBe('');
    expect(component.results().length).toBe(0);
  });

  it('should handle keyboard navigation', () => {
    component.results.set([
      { tmdbId: 1, title: 'Movie 1', overview: '', posterPath: '', backdropPath: '', releaseDate: '', voteAverage: 8, voteCount: 100, popularity: 50, genres: [] },
      { tmdbId: 2, title: 'Movie 2', overview: '', posterPath: '', backdropPath: '', releaseDate: '', voteAverage: 7, voteCount: 80, popularity: 40, genres: [] }
    ]);
    
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    component.onKeyDown(event);
    expect(component.selectedIndex()).toBe(0);
    
    component.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    expect(component.selectedIndex()).toBe(1);
    
    component.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    expect(component.selectedIndex()).toBe(0);
  });

  it('should close on Escape key', () => {
    component.isOpen.set(true);
    component.onKeyDown(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(component.isOpen()).toBeFalse();
  });
});
