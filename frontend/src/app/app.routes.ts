import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Landing page (public)
  {
    path: '',
    loadComponent: () => import('./features/landing/components/landing.component')
      .then(m => m.LandingComponent),
    canActivate: [guestGuard]
  },
  
  // Login page (public, guests only)
  {
    path: 'login',
    loadComponent: () => import('./features/auth/components/login.component')
      .then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  
  // Register page (public, guests only)
  {
    path: 'register',
    loadComponent: () => import('./features/auth/components/register.component')
      .then(m => m.RegisterComponent),
    canActivate: [guestGuard]
  },
  
  // Home page (protected)
  {
    path: 'home',
    loadComponent: () => import('./features/home/components/home.component')
      .then(m => m.HomeComponent),
    canActivate: [authGuard]
  },
  
  // Watchlist page (protected)
  {
    path: 'watchlist',
    loadComponent: () => import('./features/watchlist/components/watchlist.component')
      .then(m => m.WatchlistComponent),
    canActivate: [authGuard]
  },
  
  // Movie detail page (protected)
  {
    path: 'movie/:id',
    loadComponent: () => import('./features/movies/components/movie-detail/movie-detail.component')
      .then(m => m.MovieDetailComponent),
    canActivate: [authGuard]
  },
  
  // Social page (protected)
  {
    path: 'social',
    loadComponent: () => import('./features/social/components/social.component')
      .then(m => m.SocialComponent),
    canActivate: [authGuard]
  },
  
  // Series page (protected) - placeholder
  {
    path: 'series',
    loadComponent: () => import('./features/home/components/home.component')
      .then(m => m.HomeComponent),
    canActivate: [authGuard]
  },
  
  // Films page (protected) - placeholder
  {
    path: 'films',
    loadComponent: () => import('./features/home/components/home.component')
      .then(m => m.HomeComponent),
    canActivate: [authGuard]
  },
  
  // Redirect unknown routes to landing
  {
    path: '**',
    redirectTo: ''
  }
];
