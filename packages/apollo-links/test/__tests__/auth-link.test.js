// @flow

import {
  Observable,
  execute,
  ApolloLink,
  DocumentNode,
  Operation,
} from 'apollo-link';
import gql from 'graphql-tag';

import { AuthLink } from '../../src/AuthLink';

describe('As a developer, I can use \'AuthLink\' to send authorized requests and refresh token when it required', () => {
  const query: DocumentNode = gql`
    mutation {
      sample {
        id
      }
    }
  `;
  const workspaceId: string = 'some workspace id';
  const idToken: string = 'some id token';
  const stubLink = jest.fn(() => Observable.of());
  const onIdTokenExpired = jest.fn();
  const authLink: ApolloLink = new AuthLink({
    getAuthState: () => ({
      workspaceId,
      idToken,
    }),
    onIdTokenExpired,
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
              workspace: workspaceId,
              authorization: `Bearer ${idToken}`,
            },
          });

          resolve();
        },
      );
    }),
  );
});
