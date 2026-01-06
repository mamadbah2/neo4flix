import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';
import {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  User,
  DecodedToken,
  AuthState,
  KeycloakError,
  getAuthErrorMessage
} from '../interfaces/auth.interface';

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'neo4flix_access_token',
  REFRESH_TOKEN: 'neo4flix_refresh_token',
  EXPIRES_AT: 'neo4flix_expires_at',
  USER: 'neo4flix_user',
  RETURN_URL: 'neo4flix_return_url'
} as const;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  // Signal-based state management
  private readonly _isAuthenticated = signal<boolean>(false);
  private readonly _user = signal<User | null>(null);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Public readonly signals
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly user = this._user.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed signals
  readonly username = computed(() => this._user()?.username ?? null);
  readonly isLoggedIn = computed(() => this._isAuthenticated() && !!this.getAccessToken());

  // For token refresh synchronization
  private refreshTokenInProgress = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor() {
    this.initializeAuthState();
  }

  /**
   * Initialize auth state from localStorage on app startup
   */
  private initializeAuthState(): void {
    if (!this.isBrowser()) return;

    const token = this.getAccessToken();
    const expiresAt = this.getExpiresAt();

    if (token && expiresAt && Date.now() < expiresAt) {
      this._isAuthenticated.set(true);
      this._user.set(this.getStoredUser());
    } else {
      this.clearAuthData();
    }
  }

  /**
   * Login with username and password (Keycloak password grant)
   */
  login(credentials: LoginRequest): Observable<TokenResponse> {
    this._isLoading.set(true);
    this._error.set(null);

    const body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('client_id', environment.keycloak.clientId);
    body.set('username', credentials.username);
    body.set('password', credentials.password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<TokenResponse>(
      environment.keycloak.tokenEndpoint,
      body.toString(),
      { headers }
    ).pipe(
      tap(response => {
        this.handleAuthSuccess(response);
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);
        return this.handleAuthError(error);
      })
    );
  }

  /**
   * Refresh the access token using refresh token
   */
  refreshToken(): Observable<TokenResponse> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    if (this.refreshTokenInProgress) {
      return this.refreshTokenSubject.pipe(
        map(token => {
          if (!token) throw new Error('Token refresh failed');
          return { access_token: token } as TokenResponse;
        })
      );
    }

    this.refreshTokenInProgress = true;
    this.refreshTokenSubject.next(null);

    const body = new URLSearchParams();
    body.set('grant_type', 'refresh_token');
    body.set('client_id', environment.keycloak.clientId);
    body.set('refresh_token', refreshToken);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<TokenResponse>(
      environment.keycloak.tokenEndpoint,
      body.toString(),
      { headers }
    ).pipe(
      tap(response => {
        this.handleAuthSuccess(response);
        this.refreshTokenInProgress = false;
        this.refreshTokenSubject.next(response.access_token);
      }),
      catchError(error => {
        this.refreshTokenInProgress = false;
        this.refreshTokenSubject.next(null);
        this.logout();
        return throwError(() => error);
      })
    );
  }

  /**
   * Logout and clear all auth data
   */
  logout(): void {
    this.clearAuthData();
    this._isAuthenticated.set(false);
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  /**
   * Store the return URL before redirecting to login
   */
  setReturnUrl(url: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.RETURN_URL, url);
    }
  }

  /**
   * Get and clear the stored return URL
   */
  getAndClearReturnUrl(): string {
    if (!this.isBrowser()) return '/home';

    const url = localStorage.getItem(STORAGE_KEYS.RETURN_URL) || '/home';
    localStorage.removeItem(STORAGE_KEYS.RETURN_URL);
    return url;
  }

  /**
   * Navigate to the stored return URL after successful login
   */
  navigateToReturnUrl(): void {
    const returnUrl = this.getAndClearReturnUrl();
    this.router.navigateByUrl(returnUrl);
  }

  /**
   * Get access token from localStorage
   */
  getAccessToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * Get refresh token from localStorage
   */
  getRefreshToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Check if token is expired or about to expire (within 30 seconds)
   */
  isTokenExpired(): boolean {
    const expiresAt = this.getExpiresAt();
    if (!expiresAt) return true;
    return Date.now() >= expiresAt - 30000; // 30 seconds buffer
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this._error.set(null);
  }

  // ==========================================
  // PRIVATE METHODS
  // ==========================================

  private handleAuthSuccess(response: TokenResponse): void {
    const expiresAt = Date.now() + response.expires_in * 1000;
    const user = this.decodeToken(response.access_token);

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.access_token);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refresh_token);
      localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, expiresAt.toString());
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      }
    }

    this._isAuthenticated.set(true);
    this._user.set(user);
  }

  private handleAuthError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string;

    if (error.status === 0) {
      errorMessage = getAuthErrorMessage('network_error');
    } else if (error.status >= 500) {
      errorMessage = getAuthErrorMessage('server_error');
    } else if (error.error) {
      const keycloakError = error.error as KeycloakError;
      errorMessage = getAuthErrorMessage(keycloakError);
    } else {
      errorMessage = getAuthErrorMessage('unknown_error');
    }

    this._error.set(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private decodeToken(token: string): User | null {
    try {
      const payload = token.split('.')[1];
      const decoded: DecodedToken = JSON.parse(atob(payload));

      return {
        id: decoded.sub,
        username: decoded.preferred_username,
        email: decoded.email || '',
        firstName: decoded.given_name,
        lastName: decoded.family_name
      };
    } catch {
      return null;
    }
  }

  private getStoredUser(): User | null {
    if (!this.isBrowser()) return null;

    const userJson = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userJson) return null;

    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }

  private getExpiresAt(): number | null {
    if (!this.isBrowser()) return null;

    const expiresAt = localStorage.getItem(STORAGE_KEYS.EXPIRES_AT);
    return expiresAt ? parseInt(expiresAt, 10) : null;
  }

  private clearAuthData(): void {
    if (!this.isBrowser()) return;

    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.EXPIRES_AT);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
