import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have static row configs', () => {
    expect(component.rowConfigs.length).toBe(6);
  });

  it('should have trending row with showRank', () => {
    const trendingRow = component.rowConfigs.find(r => r.id === 'trending');
    expect(trendingRow?.showRank).toBeTrue();
  });

  it('should have popular row with showRank', () => {
    const popularRow = component.rowConfigs.find(r => r.id === 'popular');
    expect(popularRow?.showRank).toBeTrue();
  });

  it('should start with empty genre row configs', () => {
    expect(component.genreRowConfigs().length).toBe(0);
  });
});
