export const environment = {
  production: false,
  apiUrl: 'http://localhost:5050',
  keycloak: {
    url: 'http://keycloak4flix.duckdns.org',
    realm: 'neo4flix',
    clientId: 'neo4flix-app',
    clientSecret: 'x4I746Xkmejuj7zi7AC4WJh1DPk97Tyu',
    tokenEndpoint: 'http://keycloak4flix.duckdns.org/realms/neo4flix/protocol/openid-connect/token',
    adminUrl: 'http://keycloak4flix.duckdns.org/admin/realms/neo4flix'
  }
};
