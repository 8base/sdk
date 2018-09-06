import { ApolloLink, execute, Observable } from 'apollo-link';
import { TokenRefreshLink } from '../../src';
import gql from 'graphql-tag';
import errorCodes from '@8base/error-codes';

const DYNO_QUERY = gql`
  mutation {
      sample {
        id
      }
  }
`;

describe('As a developer, I can use token refresh link for auto-refresh authentication token.', () => {
  let getRefreshTokenParameters = null;
  let onAuthSuccess = null;
  let onAuthError = null;
  let onIdTokenExpired = null;
  let tokenRefreshLink = null;
  let stub = null;
  let link = null;

  beforeEach(() => {
    getRefreshTokenParameters = jest.fn(() => ({
      email: 'test-email',
      refreshToken: 'refresh-token',
    }));

    onAuthSuccess = jest.fn();

    onAuthError = jest.fn();

    onIdTokenExpired = jest.fn();

    tokenRefreshLink = new TokenRefreshLink({
      getRefreshTokenParameters,
      onAuthSuccess,
      onAuthError,
      onIdTokenExpired,
    });

    stub = jest.fn();

    stub.mockReturnValueOnce(Observable.of({
      errors: [{
        code: errorCodes.TokenExpiredErrorCode,
      }],
      data: null,
    }));

    link = ApolloLink.from([
      tokenRefreshLink, stub,
    ]);
  });

  it('When Apollo Link catch a token expired error - link should send request to refresh token.', () => {
    stub.mockReturnValueOnce(Observable.of({
      data: {
        userRefreshToken: {
          refreshToken: 'new-refresh-token',
          idToken: 'new-id-token',
        },
      },
    }));

    stub.mockReturnValueOnce(Observable.of({
      data: {
        success: true,
      },
    }));

    return new Promise((resolve, reject) => execute(link, { query: DYNO_QUERY }).subscribe(
      () => null,
      () => reject(),
      () => {
        expect(getRefreshTokenParameters).toHaveBeenCalledTimes(1);
        expect(onAuthSuccess).toHaveBeenCalledTimes(1);
        expect(onAuthSuccess.mock.calls[0][0].idToken).toBe('new-id-token');
        expect(onAuthSuccess.mock.calls[0][0].refreshToken).toBe('new-refresh-token');

        expect(stub).toHaveBeenCalledTimes(3);

        resolve();
      },
    ));
  });

  it('When Apollo Link catch a refresh token error - auth failed callback should be called.', async () => {
    stub.mockReturnValueOnce(Observable.of({
      errors: [{
        code: errorCodes.InvalidTokenErrorCode,
        message: 'Invalid Refresh Token',
      }],
      data: {
        userRefreshToken: null,
      },
    }));

    execute(link, { query: DYNO_QUERY }).subscribe(
      () => null,
      () => null,
      () => null,
    );

    await (async () => new Promise((resolve) => setTimeout(() => resolve()), 10000))();

    expect(onAuthError).toHaveBeenCalledTimes(1);
  });

  it('When Apollo Link catch a id token expired error - id token expired callback should be called.', async () => {
    stub.mockReturnValueOnce(Observable.of({
      errors: [{
        code: errorCodes.TokenExpiredErrorCode,
        message: 'Token Expired',
      }],
      data: {
        userRefreshToken: null,
      },
    }));

    execute(link, { query: DYNO_QUERY }).subscribe(
      () => null,
      () => null,
      () => null,
    );

    await (async () => new Promise((resolve) => setTimeout(() => resolve()), 10000))();

    expect(onAuthError).toHaveBeenCalledTimes(1);
  });
});
