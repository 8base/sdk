// @flow

import {
  Observable,
  execute,
  ApolloLink,
  DocumentNode,
  Operation,
} from 'apollo-link';
import gql from 'graphql-tag';

import { AuthHeadersCleanerLink } from '../../src/AuthHeadersCleanerLink';

describe('As a developer, I can use \'AuthHeadersCleanerLink\' to remove authorization header from operation\'s context', () => {
  const query: DocumentNode = gql`
    mutation {
      sample {
        id
      }
    }
  `;
  const stubLink = jest.fn(() => Observable.of());
  const links: ApolloLink = ApolloLink.from([
    new AuthHeadersCleanerLink(),
    stubLink,
  ]);

  it(
    'removes authorization header if it exists',
    () => new Promise((resolve, reject) => {
      execute(
        links,
        {
          query,
          context: {
            headers: {
              authorization: 'some id token',
              'account-id': 'some account id',
            },
            someProp: 'test',
          },
        },
      ).subscribe(
        () => null,
        () => reject(),
        () => {
          const operation: Operation = stubLink.mock.calls[0][0];
          const context = operation.getContext();

          // $FlowFixMe
          expect(context).toStrictEqual({
            headers: {
              'account-id': 'some account id',
            },
            someProp: 'test',
          });

          resolve();
        },
      );
    }),
  );
});
