import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { KeycloakService } from 'keycloak-angular';
import { AuthService } from '../services/auth.service';

/**
 * Auth Guard - Protects routes that require authentication
 * Uses Keycloak for authentication check
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Skip guard on server-side (SSR)
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  try {
    const isLoggedIn = keycloakService.isLoggedIn();
    
    if (isLoggedIn) {
      // Check if token is about to expire and refresh if needed
      if (keycloakService.isTokenExpired(30)) {
        keycloakService.updateToken(30).catch(() => {
          authService.setReturnUrl(state.url);
          keycloakService.login({
            redirectUri: window.location.origin + state.url
          });
        });
      }
      return true;
    }
  } catch {
    // Keycloak not ready
  }

  // Store the attempted URL for redirecting after login
  authService.setReturnUrl(state.url);

  // Redirect to Keycloak login
  try {
    keycloakService.login({
      redirectUri: window.location.origin + state.url
    });
  } catch {
    router.navigate(['/login']);
  }
  
  return false;
};

/**
 * Guest Guard - Prevents authenticated users from accessing login/register pages
 */
export const guestGuard: CanActivateFn = () => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Skip guard on server-side (SSR)
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  try {
    if (keycloakService.isLoggedIn()) {
      // User is already logged in, redirect to home
      router.navigate(['/home']);
      return false;
    }
  } catch {
    // Keycloak not ready, allow access
  }

  return true;
};
