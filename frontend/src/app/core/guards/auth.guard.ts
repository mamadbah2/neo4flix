import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';

/**
 * Auth Guard - Protects routes that require authentication
 * Stores the attempted URL before redirecting to login
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Skip guard on server-side (SSR)
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (authService.isLoggedIn()) {
    // Check if token is about to expire
    if (authService.isTokenExpired()) {
      // Try to refresh token
      authService.refreshToken().subscribe({
        next: () => {
          // Token refreshed, continue
        },
        error: () => {
          // Refresh failed, redirect to login
          authService.setReturnUrl(state.url);
          router.navigate(['/login']);
        }
      });
    }
    return true;
  }

  // Store the attempted URL for redirecting after login
  authService.setReturnUrl(state.url);

  // Redirect to the login page
  router.navigate(['/login']);
  return false;
};

/**
 * Guest Guard - Prevents authenticated users from accessing login/register pages
 */
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Skip guard on server-side (SSR)
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (authService.isLoggedIn()) {
    // User is already logged in, redirect to home
    router.navigate(['/home']);
    return false;
  }

  return true;
};
