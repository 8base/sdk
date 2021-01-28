import * as R from 'ramda';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { GraphQLClient } from 'graphql-request';
import errorCodes from '@8base/error-codes';

import { importWorkspace } from './importWorkspace';
import { RefreshTokenInvalidError } from './RefreshTokenInvalidError';

const USER_REFRESH_TOKEN_QUERY = gql`
  mutation UserRefreshToken($refreshToken: String!) {
    userRefreshToken(data: { refreshToken: $refreshToken }) {
      refreshToken
      idToken
    }
  }
`;

const hasIdTokenExpiredError = R.any(
  R.allPass([R.propEq('code', errorCodes.TokenExpiredErrorCode), R.propEq('message', 'Token expired')]),
);

const getRefreshToken: (obj: any) => string = R.path<any>(['userRefreshToken', 'refreshToken']);
const getIdToken: (obj: any) => string = R.path<any>(['userRefreshToken', 'idToken']);

type GraphQLClientResponse = {
  errors: object[];
  data: object;
};

type GraphQLClientRequest = {
  query: DocumentNode;
  variables: object;
};

type GraphQLClientError = {
  response: GraphQLClientResponse;
  request: GraphQLClientRequest;
};

/**
 * Client provides methods to make requests to the API.
 * @param endpoint - The endpoint which are using for make requests.
 */
class Client {
  public gqlc: GraphQLClient;

  public workspaceId?: string;
  public idToken?: string | null;
  public refreshToken?: string;

  constructor(endpoint: string) {
    this.gqlc = new GraphQLClient(endpoint);
  }

  /**
   * Update id token.
   * @param idToken - The id token.
   */
  public setIdToken(idToken: string | null) {
    this.idToken = idToken;

    if (idToken) {
      this.gqlc.setHeader('Authorization', `Bearer ${idToken}`);
    } else {
      // @ts-ignore. Check access to private variable.
      delete this.gqlc.options.headers.Authorization;
    }
  }

  /**
   * Update refresh token.
   * @param refreshToken - The refresh token.
   */
  public setRefreshToken(refreshToken: string) {
    this.refreshToken = refreshToken;
  }

  /**
   * Update workspace identifier.
   * @param workspaceId - The workspace identifier.
   */
  public setWorkspaceId(workspaceId: string) {
    this.workspaceId = workspaceId;
    this.gqlc.setHeader('workspace', workspaceId);
  }

  public async tryToRefreshToken(err: GraphQLClientError) {
    const { refreshToken } = this;

    this.setIdToken(null);

    let response = null;

    try {
      response = await this.gqlc.request(USER_REFRESH_TOKEN_QUERY, {
        refreshToken,
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

  public handleRequestErrors = (err: GraphQLClientError) => {
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
  public request(query: string | DocumentNode, variables: object = {}): Promise<any> {
    return this.gqlc.request(query, variables).catch(this.handleRequestErrors);
  }

  public importWorkspace(workspace: object) {
    return importWorkspace(this.request.bind(this), workspace);
  }
}

export { Client };
