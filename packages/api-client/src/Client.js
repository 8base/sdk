// @flow
import { GraphQLClient } from 'graphql-request';

/**
 * Client provides methods to make requests to the API.
 * @param endpoint - The endpoint which are using for make requests.
 */
class Client {
  gqlc: GraphQLClient;
  idToken: string;
  accountId: string;

  constructor(endpoint: string) {
    this.gqlc = new GraphQLClient(endpoint);
  }

  /**
   * Update id token.
   * @param idToken - The id token.
   */
  setIdToken(idToken: string) {
    this.idToken = idToken;
    this.gqlc.setHeader('Authorization', idToken);
  }

  /**
   * Update account identifier.
   * @param accountId - The account identifier.
   */
  setAccountId(accountId: string) {
    this.accountId = accountId;
    this.gqlc.setHeader('account-id', accountId);
  }

  /**
   * Send request to the API
   * @param query - GraphQL query.
   * @param variables - The variables that will be used when executing the query.
   * @returns {Promise}
   */
  request(query: string, variables: Object = {}) {
    return this.gqlc.request(query, variables);
  }
}

export { Client };
