import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KeycloakService } from 'keycloak-angular';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

/**
 * Keycloak Initialization Factory
 * Initializes Keycloak with Authorization Code + PKCE flow for 2FA support
 * Automatically syncs user with backend after successful authentication
 * 
 * @param keycloak KeycloakService instance
 * @returns Promise that resolves when Keycloak is initialized
 */
export function initializeKeycloak(keycloak: KeycloakService): () => Promise<boolean> {
  const http = inject(HttpClient);
  
  return async () => {
    // Skip initialization on server-side (SSR)
    if (typeof window === 'undefined') {
      return false;
    }

    try {
      const initialized = await keycloak.init({
        config: {
          url: environment.keycloak.url,
          realm: environment.keycloak.realm,
          clientId: environment.keycloak.clientId
        },
        initOptions: {
          // Use standard (Authorization Code) flow with PKCE - required for 2FA
          flow: 'standard',
          // Don't automatically check SSO - let user click login
          onLoad: 'check-sso',
          // Use PKCE for enhanced security
          pkceMethod: 'S256',
          // Disable iframe-based SSO check (can cause issues with mixed content/cookies)
          checkLoginIframe: false,
          // Don't use silent check - it requires specific CORS/cookie setup
          silentCheckSsoFallback: false
        },
        // Enable bearer token interceptor
        enableBearerInterceptor: true,
        // Exclude Keycloak URLs from bearer token
        bearerExcludedUrls: [
          environment.keycloak.url
        ]
      });

      // If user is logged in, sync with backend (Neo4j)
      if (initialized && keycloak.isLoggedIn()) {
        try {
          const token = keycloak.getToken();
          const user = await firstValueFrom(
            http.get(`${environment.apiUrl}/api/users/me`, {
              headers: { Authorization: `Bearer ${token}` }
            })
          );
          console.log('Keycloak: User authenticated and synced with backend:', user);
        } catch (syncError) {
          console.warn('Failed to sync user with backend:', syncError);
          // Continue anyway - user is authenticated in Keycloak
        }
      }

      return initialized;
    } catch (error) {
      console.warn('Keycloak initialization failed, continuing without auth:', error);
      // Return false to allow the app to continue loading
      // User will need to click login to authenticate
      return false;
    }
  };
}

/**
 * Keycloak Registration via Admin API
 * Uses client credentials to get admin token, then creates user
 */
export interface KeycloakRegistrationRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface KeycloakRegistrationResponse {
  success: boolean;
  message: string;
  userId?: string;
}
