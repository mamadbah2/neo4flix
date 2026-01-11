export const environment = {
  production: true,
  apiUrl: 'https://your-backend-url.vercel.app', // TODO: Remplacer par votre URL backend déployée
  keycloak: {
    url: 'https://keykloak.freeddns.org', // Votre Keycloak est déjà accessible publiquement
    realm: 'neo4flix',
    clientId: 'neo4flix-app',
    clientSecret: 'x4I746Xkmejuj7zi7AC4WJh1DPk97Tyu', // ⚠️ Ne jamais exposer en production côté client
    tokenEndpoint: 'https://keykloak.freeddns.org/realms/neo4flix/protocol/openid-connect/token',
    adminUrl: 'https://keykloak.freeddns.org/admin/realms/neo4flix'
  }
};
