import { AuthLink } from '@8base/apollo-links';
import { EightBaseApolloClient } from '../../src';

jest.mock('apollo-client', () => ({
  ApolloClient: jest.fn(args => args),
}));

jest.mock('@8base/apollo-links', () => {
  const { ApolloLink } = require('apollo-link');

  return {
    AuthLink: jest.fn(() => new ApolloLink()),
    SuccessLink: jest.fn(() => new ApolloLink()),
  };
});

describe('EightBaseApolloClient', () => {
  const onRequestError = jest.fn();
  const onRequestSuccess = jest.fn();
  const getAuthState = jest.fn();
  const getRefreshTokenParameters = jest.fn();
  const onAuthSuccess = jest.fn();
  const onAuthError = jest.fn();
  const onIdTokenExpired = jest.fn();
  const uri = 'http://8base.com';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create EightBaseApolloClient with auth', () => {
    new EightBaseApolloClient({
      uri,
      onRequestError,
      onRequestSuccess,
      getAuthState,
      getRefreshTokenParameters,
      onAuthSuccess,
      onAuthError,
      onIdTokenExpired,
    });

    expect((AuthLink as any).mock.calls[0][0]).toEqual({
      getAuthState,
      getRefreshTokenParameters,
      onAuthError,
      onAuthSuccess,
      onIdTokenExpired,
    });
  });


  it('should create EightBaseApolloClient without auth', () => {

    new EightBaseApolloClient({
      withAuth: false,
      uri,
      onRequestError,
      onRequestSuccess,
      getAuthState,
      getRefreshTokenParameters,
      onAuthSuccess,
    });

    expect(AuthLink).not.toHaveBeenCalled();
  });
});
