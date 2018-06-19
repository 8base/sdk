// @flow
import { GraphQLClient } from 'graphql-request';

/**
 * Client provides methods to make requests to the API.
 * @param endpoint - The endpoint which are using for make requests.
 */
class Client {
  gqlc: GraphQLClient;
  token: string;
  accountId: string;
  organizationId: string;

  constructor(endpoint: string) {
    this.gqlc = new GraphQLClient(endpoint);
  }

  /**
   * Update authorization token.
   * @param token - The authorization token.
   */
  setToken(token: string) {
    this.token = token;
    this.gqlc.setHeader('Authorization', token);
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
   * Update organization identifier.
   * @param organizationId - The organization identifier.
   */
  setOrganizationId(organizationId: string) {
    this.organizationId = organizationId;
    this.gqlc.setHeader('organization-id', organizationId);
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
