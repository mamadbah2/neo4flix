export const environment = {
  production: true,
  apiUrl: 'https://api.neo4flix.com',
  keycloak: {
    url: 'https://keycloak.neo4flix.com',
    realm: 'neo4flix',
    clientId: 'neo4flix-app',
    tokenEndpoint: 'https://keycloak.neo4flix.com/realms/neo4flix/protocol/openid-connect/token'
  }
};
