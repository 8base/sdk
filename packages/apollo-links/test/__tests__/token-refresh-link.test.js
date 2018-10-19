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
  let onAuthError = null;
  let onIdTokenExpired = null;
  let tokenRefreshLink = null;
  let stub = null;
  let link = null;

  beforeEach(() => {
    onAuthError = jest.fn();

    onIdTokenExpired = jest.fn();

    tokenRefreshLink = new TokenRefreshLink({
      onAuthError,
      onIdTokenExpired,
    });

    stub = jest.fn();

    stub.mockReturnValueOnce(Observable.of({
      errors: [
        {
          code: errorCodes.TokenExpiredErrorCode,
          message: 'Token expired',
          details: {
            token: 'jwt expired',
          },
        },
      ],
    }));

    link = ApolloLink.from([
      tokenRefreshLink, stub,
    ]);
  });

  it('When Apollo Link catch a token expired error - link should send request to refresh token.', () => {
    onIdTokenExpired.mockImplementation(() => Promise.resolve());
    stub.mockReturnValueOnce(Observable.of({
      data: {
        success: true,
      },
    }));

    return new Promise((resolve, reject) => execute(link, { query: DYNO_QUERY }).subscribe(
      () => null,
      () => reject(),
      () => {
        expect(onIdTokenExpired).toHaveBeenCalledTimes(1);
        expect(stub).toHaveBeenCalledTimes(2);

        resolve();
      },
    ));
  });

  it('When Apollo Link catch a refresh token error - auth failed callback should be called.', () => {
    onIdTokenExpired.mockImplementation(() => Promise.reject());

    return new Promise((resolve, reject) => execute(link, { query: DYNO_QUERY }).subscribe(
      () => null,
      () => reject(),
      () => {
        expect(onIdTokenExpired).toHaveBeenCalledTimes(1);
        expect(onAuthError).toHaveBeenCalledTimes(1);
        expect(stub).toHaveBeenCalledTimes(1);

        resolve();
      },
    ));

  });
});
