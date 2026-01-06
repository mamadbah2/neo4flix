// ===========================================
// AUTH INTERFACES
// ===========================================

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  not_before_policy?: number;
  session_state?: string;
  scope: string;
}

export interface DecodedToken {
  exp: number;
  iat: number;
  sub: string;
  preferred_username: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  realm_access?: {
    roles: string[];
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

// ===========================================
// USER INTERFACES
// ===========================================

export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface FollowStatus {
  following: boolean;
}

// ===========================================
// ERROR INTERFACES
// ===========================================

export interface KeycloakError {
  error: string;
  error_description: string;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

// ===========================================
// AUTH ERROR MESSAGES (French)
// ===========================================

export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'invalid_grant': 'Identifiant ou mot de passe incorrect.',
  'invalid_client': 'Erreur de configuration. Contactez le support.',
  'unauthorized_client': 'Client non autorisé.',
  'invalid_request': 'Requête invalide. Veuillez réessayer.',
  'invalid_scope': 'Scope invalide.',
  'unsupported_grant_type': 'Type d\'authentification non supporté.',
  'account_disabled': 'Votre compte a été désactivé.',
  'account_temporarily_locked': 'Compte temporairement bloqué. Réessayez plus tard.',
  'expired_code': 'Code expiré. Veuillez réessayer.',
  'access_denied': 'Accès refusé.',
  'user_not_found': 'Utilisateur non trouvé.',
  'invalid_token': 'Session expirée. Veuillez vous reconnecter.',
  'network_error': 'Erreur réseau. Vérifiez votre connexion.',
  'server_error': 'Erreur serveur. Veuillez réessayer plus tard.',
  'unknown_error': 'Une erreur inattendue s\'est produite.'
};

/**
 * Get localized error message from Keycloak error response
 */
export function getAuthErrorMessage(error: string | KeycloakError): string {
  if (typeof error === 'string') {
    return AUTH_ERROR_MESSAGES[error] || AUTH_ERROR_MESSAGES['unknown_error'];
  }
  return AUTH_ERROR_MESSAGES[error.error] || error.error_description || AUTH_ERROR_MESSAGES['unknown_error'];
}
