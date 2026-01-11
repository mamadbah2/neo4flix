export const environment = {
  production: false,
  apiUrl: 'https://neo4flix.freeddns.org',
  keycloak: {
    url: 'https://keykloak.freeddns.org',
    realm: 'neo4flix',
    clientId: 'neo4flix-app',
    clientSecret: 'x4I746Xkmejuj7zi7AC4WJh1DPk97Tyu',
    tokenEndpoint: 'https://keykloak.freeddns.org/realms/neo4flix/protocol/openid-connect/token',
    adminUrl: 'https://keykloak.freeddns.org/admin/realms/neo4flix'
  }
};
