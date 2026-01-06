import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Public pages - SSR enabled for SEO
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'login',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'register',
    renderMode: RenderMode.Prerender
  },
  
  // Protected pages - Client-side rendering only (no SSR)
  // These require authentication which is client-side only
  {
    path: 'home',
    renderMode: RenderMode.Client
  },
  {
    path: 'watchlist',
    renderMode: RenderMode.Client
  },
  {
    path: 'social',
    renderMode: RenderMode.Client
  },
  {
    path: 'series',
    renderMode: RenderMode.Client
  },
  {
    path: 'films',
    renderMode: RenderMode.Client
  },
  
  // Fallback
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
