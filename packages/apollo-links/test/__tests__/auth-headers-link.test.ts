import { Observable, execute, ApolloLink, DocumentNode, Operation } from 'apollo-link';
import gql from 'graphql-tag';

import { AuthHeadersLink } from '../../src/AuthHeadersLink';

describe("As a developer, I can use 'AuthHeadersLink' to add authorization headers to operation's context", () => {
  const query: DocumentNode = gql`
    mutation {
      sample {
        id
      }
    }
  `;
  const workspaceId: string = 'some workspace id';
  const token: string = 'some id token';
  const stubLink: any = jest.fn(() => Observable.of());
  const getAuthState = jest.fn();
  const authHeadersLink: ApolloLink = new AuthHeadersLink({ getAuthState });
  const links: ApolloLink = ApolloLink.from([authHeadersLink, stubLink]);

  it('adds authorization headers', () =>
    new Promise((resolve, reject) => {
      getAuthState.mockReturnValueOnce(
        Promise.resolve({
          workspaceId,
          token,
        }),
      );

      execute(links, { query }).subscribe(
        () => null,
        () => reject(),
        () => {
          const operation = stubLink.mock.calls[0][0];
          const context = operation.getContext();

          // $FlowFixMe
          expect(context).toStrictEqual({
            headers: {
              workspace: workspaceId,
              authorization: `Bearer ${token}`,
            },
          });

          resolve();
        },
      );
    }));

  it("doesn't add headers if they don't exist", () =>
    new Promise((resolve, reject) => {
      stubLink.mockClear();

      getAuthState.mockReturnValueOnce(
        Promise.resolve({
          workspaceId: '',
          token: 'some-id-token',
        }),
      );

      execute(links, { query }).subscribe(
        () => null,
        () => reject(),
        () => {
          const operation: Operation = stubLink.mock.calls[0][0];
          const context = operation.getContext();

          // $FlowFixMe
          expect(context).toStrictEqual({
            headers: {
              authorization: 'Bearer some-id-token',
            },
          });

          resolve();
        },
      );
    }));
});
