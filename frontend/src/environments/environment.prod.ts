export const environment = {
  production: true,
  apiUrl: 'https://your-backend-url.vercel.app', // TODO: Remplacer par votre URL backend déployée
  keycloak: {
    url: 'http://keycloak4flix.duckdns.org', // Votre Keycloak est déjà accessible publiquement
    realm: 'neo4flix',
    clientId: 'neo4flix-app',
    clientSecret: 'x4I746Xkmejuj7zi7AC4WJh1DPk97Tyu', // ⚠️ Ne jamais exposer en production côté client
    tokenEndpoint: 'http://keycloak4flix.duckdns.org/realms/neo4flix/protocol/openid-connect/token',
    adminUrl: 'http://keycloak4flix.duckdns.org/admin/realms/neo4flix'
  }
};
