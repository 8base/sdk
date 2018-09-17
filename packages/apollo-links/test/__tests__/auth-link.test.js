// @flow

import {
  Observable,
  execute,
  ApolloLink,
  DocumentNode,
  Operation,
} from 'apollo-link';
import gql from 'graphql-tag';
import errorCodes from '@8base/error-codes';

import { AuthLink } from '../../src/AuthLink';

describe('As a developer, I can use \'AuthLink\' to send authorized requests and refresh token when it required', () => {
  const query: DocumentNode = gql`
    mutation {
      sample {
        id
      }
    }
  `;
  const accountId: string = 'some account id';
  const idToken: string = 'some id token';
  const stubLink = jest.fn(() => Observable.of());
  const authLink: ApolloLink = new AuthLink({
    getAuthState: () => ({
      accountId,
      idToken,
    }),
    getRefreshTokenParameters: () => ({
      email: 'some email',
      refreshToken: 'some refresh token',
    }),
    onAuthSuccess: () => {},
  });
  const links: ApolloLink = ApolloLink.from([
    authLink,
    stubLink,
  ]);

  it(
    'adds headers for the authorization by default',
    () => new Promise((resolve, reject) => {
      execute(links, { query }).subscribe(
        () => null,
        () => reject(),
        () => {
          const operation: Operation = stubLink.mock.calls[0][0];
          const context = operation.getContext();

          // $FlowFixMe
          expect(context).toStrictEqual({
            headers: {
              'account-id': accountId,
              authorization: `Bearer ${idToken}`,
            },
          });

          resolve();
        },
      );
    }),
  );

  it(
    'removes authorization header if there is token refresh operation',
    () => new Promise((resolve, reject) => {
      stubLink.mockClear();
      stubLink.mockReturnValueOnce(Observable.of({
        errors: [{
          code: errorCodes.TokenExpiredErrorCode,
          details: {
            idToken: 'Expired Id Token',
          },
        }],
        data: null,
      }));
      stubLink.mockReturnValueOnce(Observable.of({
        data: {
          userRefreshToken: {
            refreshToken: 'new refresh token',
            idToken: 'new id token',
          },
        },
      }));
      stubLink.mockReturnValueOnce(Observable.of({
        data: {
          success: true,
        },
      }));

      execute(links, { query }).subscribe(
        () => null,
        () => reject(),
        () => {
          expect(stubLink).toHaveBeenCalledTimes(3);

          const firstOperation: Operation = stubLink.mock.calls[0][0];
          const firstContext = firstOperation.getContext();
          const secondOperation: Operation = stubLink.mock.calls[1][0];
          const secondContext = secondOperation.getContext();
          const thirdOperation: Operation = stubLink.mock.calls[2][0];
          const thirdContext = thirdOperation.getContext();

          // First query request
          // $FlowFixMe
          expect(firstContext).toStrictEqual({
            headers: {
              authorization: `Bearer ${idToken}`,
              'account-id': accountId,
            },
          });

          // Refresh token request
          // $FlowFixMe
          expect(secondContext).toStrictEqual({
            headers: {
              'account-id': accountId,
            },
            isRefreshingToken: true,
          });

          // Second equery request
          // $FlowFixMe
          expect(thirdContext).toStrictEqual({
            headers: {
              authorization: `Bearer ${idToken}`,
              'account-id': accountId,
            },
          });

          resolve();
        },
      );
    }),
  );
});
