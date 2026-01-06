export const environment = {
  production: false,
  apiUrl: 'http://localhost:5050',
  keycloak: {
    url: 'http://keycloak4flix.duckdns.org',
    realm: 'neo4flix',
    clientId: 'neo4flix-app',
    tokenEndpoint: 'http://keycloak4flix.duckdns.org/realms/neo4flix/protocol/openid-connect/token'
  }
};
