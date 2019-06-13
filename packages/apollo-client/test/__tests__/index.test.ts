import { ApolloLink } from 'apollo-link';
import { AuthLink, SignUpLink } from '@8base/apollo-links';
import { ApolloClient } from '../../src';

jest.mock('apollo-client', () => ({
  ApolloClient: jest.fn(args => args),
}));

jest.mock('@8base/apollo-links', () => {
  return {
    AuthLink: jest.fn(() => new ApolloLink()),
    SuccessLink: jest.fn(() => new ApolloLink()),
    SignUpLink: jest.fn(() => new ApolloLink()),
  };
});

describe('ApolloClient', () => {
  const onRequestError = jest.fn();
  const onRequestSuccess = jest.fn();
  const getAuthState = jest.fn();
  const getRefreshTokenParameters = jest.fn();
  const onAuthSuccess = jest.fn();
  const onAuthError = jest.fn();
  const onIdTokenExpired = jest.fn();
  const uri = 'http://8base.com';
  const authProfileId = 'someProfileId';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create ApolloClient with auth', () => {
    const temp = new ApolloClient({
      uri,
      onRequestError,
      onRequestSuccess,
      getAuthState,
      getRefreshTokenParameters,
      onAuthSuccess,
      onAuthError,
      onIdTokenExpired,
      autoSignUp: true,
      authProfileId,
    });

    expect((AuthLink as any).mock.calls[0][0]).toEqual({
      getAuthState,
      getRefreshTokenParameters,
      onAuthError,
      onAuthSuccess,
      onIdTokenExpired,
    });

    expect((SignUpLink as any).mock.calls[0][0]).toEqual({
      getAuthState,
      authProfileId,
    });
  });

  it('should create ApolloClient without auto sign up', () => {
    const temp = new ApolloClient({
      uri,
      onRequestError,
      onRequestSuccess,
      getAuthState,
      getRefreshTokenParameters,
      onAuthSuccess,
      onAuthError,
      onIdTokenExpired,
      autoSignUp: false,
    });

    expect((AuthLink as any).mock.calls[0][0]).toEqual({
      getAuthState,
      getRefreshTokenParameters,
      onAuthError,
      onAuthSuccess,
      onIdTokenExpired,
    });

    expect(SignUpLink).not.toHaveBeenCalled();
  });

  it('should create ApolloClient without auth', () => {
    const temp = new ApolloClient({
      getAuthState,
      getRefreshTokenParameters,
      onAuthSuccess,
      onRequestError,
      onRequestSuccess,
      uri,
      withAuth: false,
    });

    expect(AuthLink).not.toHaveBeenCalled();

    expect(SignUpLink).not.toHaveBeenCalled();
  });
});
