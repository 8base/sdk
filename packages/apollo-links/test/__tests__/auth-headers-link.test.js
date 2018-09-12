// @flow

import {
  Observable,
  execute,
  ApolloLink,
  DocumentNode,
  Operation,
} from 'apollo-link';
import gql from 'graphql-tag';

import { createAuthHeadersLink } from '../../src/authHeadersLink';

describe('As a developer, I can use \'authHeadersLink\' to add authorization headers to operation\'s context', () => {
  const query: DocumentNode = gql`
    mutation {
      sample {
        id
      }
    }
  `;
  const accountId: string = 'some account id';
  const organizationId: string = 'some organization id';
  const idToken: string = 'some id token';
  const stubLink = jest.fn(() => Observable.of());
  const getAuthState = jest.fn();
  const authHeadersLink: ApolloLink = createAuthHeadersLink({ getAuthState });
  const links: ApolloLink = ApolloLink.from([
    authHeadersLink,
    stubLink,
  ]);

  it(
    'adds authorization headers',
    () => new Promise((resolve, reject) => {
      getAuthState.mockReturnValueOnce({
        accountId,
        organizationId,
        idToken,
      });

      execute(
        links,
        { query },
      ).subscribe(
        () => null,
        () => reject(),
        () => {
          const operation = stubLink.mock.calls[0][0];
          const context = operation.getContext();

          // $FlowFixMe
          expect(context).toStrictEqual({
            headers: {
              'account-id': accountId,
              authorization: `Bearer ${idToken}`,
              'organization-id': organizationId,
            },
          });

          resolve();
        },
      );
    }),
  );

  it(
    'doesn\'t add headers if they don\'t exist',
    () => new Promise((resolve, reject) => {
      stubLink.mockClear();

      getAuthState.mockReturnValueOnce({
        accountId: '',
        idToken: 'some-id-token',
        organizationId: undefined,
      });

      execute(
        links,
        { query },
      ).subscribe(
        () => null,
        () => reject(),
        () => {
          const operation: Operation = stubLink.mock.calls[0][0];
          const context = operation.getContext();

          // $FlowFixMe
          expect(context).toStrictEqual({ headers: {
            authorization: 'Bearer some-id-token',
          }});

          resolve();
        },
      );
    }),
  );
});
