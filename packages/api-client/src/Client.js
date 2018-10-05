// @flow
import type { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { GraphQLClient } from 'graphql-request';
import { hasIdTokenExpiredError } from '@8base/utils';
import * as R from 'ramda';

const USER_REFRESH_TOKEN_QUERY = gql`
  mutation UserRefreshToken($refreshToken: String!, $email: String!) {
    userRefreshToken(data: {
      refreshToken: $refreshToken,
      email: $email,
    }) {
      refreshToken
      idToken
    }
  }
`;

const getRefreshToken = R.path(['userRefreshToken', 'refreshToken']);
const getIdToken = R.path(['userRefreshToken', 'idToken']);

type GraphQLClientResponse = {
  errors: Array<Object>,
  data: Object,
};

type GraphQLClientRequest = {
  query: DocumentNode,
  variables: Object,
};

type GraphQLClientError = {
  response: GraphQLClientResponse,
  request: GraphQLClientRequest,
};

class RefreshTokenInvalidError extends Error {
  constructor() {
    super('Can\'t refresh token.');
  }
}

/**
 * Client provides methods to make requests to the API.
 * @param endpoint - The endpoint which are using for make requests.
 */
class Client {
  gqlc: GraphQLClient;

  workspaceId: string;
  email: string;
  idToken: ?string;
  refreshToken: string;

  constructor(endpoint: string) {
    this.gqlc = new GraphQLClient(endpoint);
  }

  /**
   * Update id token.
   * @param idToken - The id token.
   */
  setIdToken(idToken: ?string) {
    this.idToken = idToken;

    if (idToken) {
      this.gqlc.setHeader('Authorization', `Bearer ${idToken}`);
    } else {
      delete this.gqlc.options.headers.Authorization;
    }
  }

  /**
   * Update refresh token.
   * @param refreshToken - The refresh token.
   */
  setRefreshToken(refreshToken: string) {
    this.refreshToken = refreshToken;
  }

  /**
   * Update user email.
   * @param email - The user email.
   */
  setEmail(email: string) {
    this.email = email;
  }

  /**
   * Update workspace identifier.
   * @param workspaceId - The workspace identifier.
   */
  setWorkspaceId(workspaceId: string) {
    this.workspaceId = workspaceId;
    this.gqlc.setHeader('workspace', workspaceId);
  }

  async tryToRefreshToken(err: GraphQLClientError) {
    const { refreshToken, email } = this;

    this.setIdToken(null);

    let response = null;

    try {
      response = await this.gqlc.request(USER_REFRESH_TOKEN_QUERY, {
        refreshToken,
        email,
      });
    } catch (err) {
      throw new RefreshTokenInvalidError();
    }

    const newRefreshToken = getRefreshToken(response);
    const newIdToken = getIdToken(response);

    this.setRefreshToken(newRefreshToken);
    this.setIdToken(newIdToken);

    return this.request(err.request.query, err.request.variables);
  }

  handleRequestErrors = (err: GraphQLClientError) => {
    // $FlowFixMe
    if (hasIdTokenExpiredError(R.pathOr([], ['response', 'errors'], err))) {
      return this.tryToRefreshToken(err);
    }
    throw err;

  };

  /**
   * Send request to the API
   * @param query - GraphQL query.
   * @param variables - The variables that will be used when executing the query.
   * @returns {Promise}
   */
  request(query: string | DocumentNode, variables: Object = {}) {
    return this.gqlc.request(query, variables).catch(this.handleRequestErrors);
  }
}

export { Client };
