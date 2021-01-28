import { ApolloLink, Observable, execute } from '@apollo/client';
import gql from 'graphql-tag';
import errorCodes from '@8base/error-codes';

import { SuccessLink } from '../../src';

const TEST_QUERY = gql`
  query {
    test {
      id
    }
  }
`;

describe('As a developer i can use SuccessLink to handle success graphql operations', () => {
  it('calls handler on successful operation', done => {
    const terminatingLink: any = () => Observable.of({});
    const successHandler = jest.fn();

    const links = ApolloLink.from([new SuccessLink({ successHandler }), terminatingLink]);

    execute(links, { query: TEST_QUERY, variables: {} }).subscribe({
      complete: () => {
        expect(successHandler).toHaveBeenCalled();

        done();
      },
    });
  });

  it("doesn't call handler on operation with error", done => {
    const terminatingLink: any = () =>
      Observable.of({
        errors: [
          {
            code: errorCodes.TokenExpiredErrorCode,
            message: 'Token expired',
            details: {
              token: 'jwt expired',
            },
          },
        ],
      });
    const successHandler = jest.fn();

    const links = ApolloLink.from([new SuccessLink({ successHandler }), terminatingLink]);

    execute(links, { query: TEST_QUERY, variables: {} }).subscribe({
      complete: () => {
        expect(successHandler).not.toHaveBeenCalled();

        done();
      },
    });
  });
});
