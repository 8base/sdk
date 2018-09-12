import { ApolloLink, Observable, execute } from 'apollo-link';
import gql from 'graphql-tag';

import { onSuccess } from '../../src';

const TEST_QUERY = gql`
  query {
    test {
      id
    }
  }
`;

describe('As a developer i can use onSuccess link to handle success graphql operations', () => {
  it('calls handler on successful operation', () => {
    const terminatingLink = () => Observable.of({});
    const successHandler = jest.fn();

    const links = ApolloLink.from([
      onSuccess(successHandler),
      terminatingLink,
    ]);

    execute(links, { query: TEST_QUERY, variables: {}}).subscribe({
      complete: () => {
        expect(successHandler).toHaveBeenCalled();
      },
    });
  });

  it('doesn\'t call handler on unsuccessful operation', () => {
    const errorTerminatingLink = () => new Observable(observer => {
      observer.error(new Error());
    });
    const successHandler = jest.fn();

    const links = ApolloLink.from([
      onSuccess(successHandler),
      errorTerminatingLink,
    ]);

    execute(links, { query: TEST_QUERY, variables: {}}).subscribe({
      complete: () => {
        expect(successHandler).not.toHaveBeenCalled();
      },
    });
  });
});
