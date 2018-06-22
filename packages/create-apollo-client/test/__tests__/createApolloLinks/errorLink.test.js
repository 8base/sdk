// @flow

import { createApolloLinks } from '../../../src/createApolloLinks';

jest.mock('apollo-link-error', () => {
  const { ApolloLink } = require('apollo-link');

  return {
    onError: (callback) => {
      callback({ graphQLErrors: 'grphql-error', networkError: 'network-error' });

      return new ApolloLink((operation, forward) => forward(operation));
    },
  };
});

const uri = 'http://api.test.8base.com';

const getAuthState = () => ({
  email: 'user-name@gmail.com',
  accountId: 'account-id-bcxcvboiet',
  organizationId: 'organization-id-142',
  refreshToken: 'refresh-token-asdasdafaqwebfdhgh,dlphgkmw092y09qkefskbnq0921r',
  idToken: 'id-token-glhjkoerjhyldkmn;vjioghlblafeorhn',
});


describe('As a Developer, I Can use error link to catch errors', () => {

  it('should call errors callback', () => {
    const onGraphQLErrors = jest.fn();
    const onNetworkError = jest.fn();

    createApolloLinks({
      getAuthState,
      uri,
      links: {
        error: {
          onGraphQLErrors,
          onNetworkError,
        },
      },
    });

    expect(onGraphQLErrors).toBeCalledWith('grphql-error');
    expect(onNetworkError).toBeCalledWith('network-error');
  });

  it('should not call errors callback then error link disabled', () => {
    const onGraphQLErrors = jest.fn();
    const onNetworkError = jest.fn();

    createApolloLinks({
      getAuthState,
      uri,
      links: {
        error: {
          enable: false,
          onGraphQLErrors,
          onNetworkError,
        },
      },
    });

    expect(onGraphQLErrors).not.toBeCalled();
    expect(onNetworkError).not.toBeCalled();
  });
});
