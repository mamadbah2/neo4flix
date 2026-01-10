import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, of, from } from 'rxjs';
import { tap, catchError, map, switchMap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { KeycloakService } from 'keycloak-angular';
import { environment } from '../../../environments/environment';
import {
  RegisterRequest,
  TokenResponse,
  User
} from '../interfaces/auth.interface';

const STORAGE_KEYS = {
  RETURN_URL: 'neo4flix_return_url',
  USER: 'neo4flix_user'
} as const;

/**
 * AuthService - Keycloak-based authentication with 2FA support
 * Uses Authorization Code + PKCE flow via keycloak-angular
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly keycloakService = inject(KeycloakService);

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
  readonly isLoggedIn = computed(() => {
    try {
      return this._isAuthenticated() && this.keycloakService.isLoggedIn();
    } catch {
      return this._isAuthenticated();
    }
  });

  constructor() {
    this.initializeAuthState();
  }

  /**
   * Initialize auth state from Keycloak on app startup
   */
  private initializeAuthState(): void {
    if (!this.isBrowser()) return;

    try {
      const isLoggedIn = this.keycloakService.isLoggedIn();
      this._isAuthenticated.set(isLoggedIn);

      if (isLoggedIn) {
        this.loadUserProfile();
      }
    } catch {
      // Keycloak not ready yet - will be checked later
    }
  }

  /**
   * Load user profile from Keycloak token
   */
  private loadUserProfile(): void {
    if (!this.isBrowser()) return;

    try {
      const keycloakInstance = this.keycloakService.getKeycloakInstance();
      if (keycloakInstance.tokenParsed) {
        const tokenParsed = keycloakInstance.tokenParsed as Record<string, unknown>;
        const user: User = {
          id: tokenParsed['sub'] as string,
          username: tokenParsed['preferred_username'] as string,
          email: tokenParsed['email'] as string || '',
          firstName: tokenParsed['given_name'] as string,
          lastName: tokenParsed['family_name'] as string
        };
        this._user.set(user);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

        // Sync with backend
        this.syncUserWithBackend().subscribe();
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  }

  /**
   * Login by redirecting to Keycloak login page
   * Keycloak handles password + 2FA (OTP) flow
   */
  login(): Observable<void> {
    this._isLoading.set(true);
    this._error.set(null);

    const returnUrl = this.getReturnUrl() || '/home';
    
    return from(this.keycloakService.login({
      redirectUri: window.location.origin + returnUrl
    })).pipe(
      tap(() => {
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);
        this._error.set('Erreur de connexion. Veuillez réessayer.');
        return throwError(() => error);
      })
    );
  }

  /**
   * Register a new user via Keycloak Admin API
   */
  register(request: RegisterRequest): Observable<{ success: boolean; message: string }> {
    this._isLoading.set(true);
    this._error.set(null);

    const tokenBody = new URLSearchParams();
    tokenBody.set('grant_type', 'client_credentials');
    tokenBody.set('client_id', environment.keycloak.clientId);
    tokenBody.set('client_secret', environment.keycloak.clientSecret);

    const tokenHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<TokenResponse>(
      environment.keycloak.tokenEndpoint,
      tokenBody.toString(),
      { headers: tokenHeaders }
    ).pipe(
      switchMap(tokenResponse => {
        const userPayload = {
          username: request.username,
          email: request.email,
          enabled: true,
          firstName: request.firstName || '',
          lastName: request.lastName || '',
          credentials: [
            {
              type: 'password',
              value: request.password,
              temporary: false
            }
          ]
        };

        const createHeaders = new HttpHeaders({
          'Authorization': 'Bearer ' + tokenResponse.access_token,
          'Content-Type': 'application/json'
        });

        return this.http.post(
          environment.keycloak.adminUrl + '/users',
          userPayload,
          { headers: createHeaders, observe: 'response' }
        );
      }),
      map(response => {
        this._isLoading.set(false);
        if (response.status === 201) {
          return {
            success: true,
            message: 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.'
          };
        }
        return {
          success: false,
          message: 'Erreur inattendue lors de la création du compte.'
        };
      }),
      catchError((error: HttpErrorResponse) => {
        this._isLoading.set(false);
        
        let message = 'Erreur lors de la création du compte.';
        
        if (error.status === 409) {
          message = 'Ce nom d\'utilisateur ou cette adresse e-mail est déjà utilisé.';
        } else if (error.status === 400) {
          message = 'Données invalides. Vérifiez vos informations.';
        } else if (error.status === 401 || error.status === 403) {
          message = 'Erreur d\'authentification du service.';
        }
        
        this._error.set(message);
        return throwError(() => new Error(message));
      })
    );
  }

  /**
   * Sync user with backend
   */
  syncUserWithBackend(): Observable<User> {
    return this.http.get<User>(environment.apiUrl + '/api/users/me').pipe(
      tap(user => {
        this._user.set(user);
        if (this.isBrowser()) {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        }
      }),
      catchError(error => {
        console.error('Failed to sync user with backend:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Refresh the access token
   */
  refreshToken(): Observable<string> {
    if (!this.isBrowser()) {
      return throwError(() => new Error('Not in browser'));
    }

    return from(this.keycloakService.updateToken(30)).pipe(
      map(() => {
        const token = this.keycloakService.getKeycloakInstance().token;
        return token || '';
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  /**
   * Logout
   */
  logout(): void {
    if (!this.isBrowser()) return;

    this._isAuthenticated.set(false);
    this._user.set(null);
    this.clearLocalData();
    
    this.keycloakService.logout(window.location.origin + '/login');
  }

  setReturnUrl(url: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.RETURN_URL, url);
    }
  }

  getReturnUrl(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(STORAGE_KEYS.RETURN_URL);
  }

  getAndClearReturnUrl(): string {
    if (!this.isBrowser()) return '/home';
    const url = localStorage.getItem(STORAGE_KEYS.RETURN_URL) || '/home';
    localStorage.removeItem(STORAGE_KEYS.RETURN_URL);
    return url;
  }

  navigateToReturnUrl(): void {
    const returnUrl = this.getAndClearReturnUrl();
    this.router.navigateByUrl(returnUrl);
  }

  getAccessToken(): string | null {
    if (!this.isBrowser()) return null;
    try {
      return this.keycloakService.getKeycloakInstance().token || null;
    } catch {
      return null;
    }
  }

  getRefreshToken(): string | null {
    if (!this.isBrowser()) return null;
    try {
      return this.keycloakService.getKeycloakInstance().refreshToken || null;
    } catch {
      return null;
    }
  }

  isTokenExpired(): boolean {
    if (!this.isBrowser()) return true;
    try {
      return this.keycloakService.isTokenExpired(30);
    } catch {
      return true;
    }
  }

  clearError(): void {
    this._error.set(null);
  }

  hasRole(role: string): boolean {
    try {
      return this.keycloakService.isUserInRole(role);
    } catch {
      return false;
    }
  }

  getUserRoles(): string[] {
    try {
      return this.keycloakService.getUserRoles();
    } catch {
      return [];
    }
  }

  private clearLocalData(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.RETURN_URL);
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
