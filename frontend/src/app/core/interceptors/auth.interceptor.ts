import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

/**
 * Auth Interceptor - Adds Bearer token to API requests
 * Handles 401 errors with token refresh and retry
 */
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);

  // Skip interceptor for Keycloak token endpoint
  if (req.url.includes(environment.keycloak.url)) {
    return next(req);
  }

  // Only add token for API requests
  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const token = authService.getAccessToken();

  // If no token, proceed without auth header
  if (!token) {
    return next(req);
  }

  // Clone request and add Authorization header
  const authReq = addTokenToRequest(req, token);

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized - try to refresh token
      if (error.status === 401) {
        return handleUnauthorizedError(req, next, authService);
      }
      return throwError(() => error);
    })
  );
};

/**
 * Add Bearer token to request headers
 */
function addTokenToRequest(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Handle 401 error by refreshing token and retrying the request
 */
function handleUnauthorizedError(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService
) {
  // If token is expired, try to refresh
  if (authService.getRefreshToken()) {
    return authService.refreshToken().pipe(
      switchMap(newToken => {
        // Retry the original request with new token
        const retryReq = addTokenToRequest(req, newToken);
        return next(retryReq);
      }),
      catchError(refreshError => {
        // Refresh failed, logout user
        authService.logout();
        return throwError(() => refreshError);
      })
    );
  }

  // No refresh token available, logout
  authService.logout();
  return throwError(() => new Error('Session expired. Please login again.'));
}
