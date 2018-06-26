// @flow
import { createApolloLinks } from '../../../src/createApolloLinks';

jest.mock('@8base/sdk', () => {
  const { ApolloLink } = require('apollo-link');

  class TokenRefreshMockLink extends ApolloLink {
    constructor(options: any) {
      super(options);

      const { setRefreshTokenInput, authReceived, authFailed } = options;

      setRefreshTokenInput();

      authReceived({
        idToken: 'id-token',
        refreshToken: 'refresh-token',
      });

      authFailed({ message: 'error' });
    }
  }

  return {
    FileUploadLink: ApolloLink,
    TokenRefreshLink: TokenRefreshMockLink,
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


describe('As a Developer, I Can use 8base compability refresh token link', () => {

  it('should call token refresh callbacks', () => {
    const onIdTokenExpired = jest.fn();
    const onUpdateTokenFail = jest.fn();
    const onUpdateTokenSuccess = jest.fn();

    createApolloLinks({
      getAuthState,
      uri,
      links: {
        tokenRefresh: {
          onIdTokenExpired,
          onUpdateTokenFail,
          onUpdateTokenSuccess,
        },
      },
    });

    expect(onIdTokenExpired).toBeCalled();
    expect(onUpdateTokenFail).toBeCalledWith({ message: 'error' });
    expect(onUpdateTokenSuccess).toBeCalledWith({
      idToken: 'id-token',
      refreshToken: 'refresh-token',
    });
  });

  it('should throw an error then getAuthstate not provided', () => {
    let error = {};

    try {
      createApolloLinks({
        uri,
        links: { auth: { enable: false }},
      });
    }
    catch (err) {
      error = err;
    }
    finally {
      expect(error.message).toBe('Excepted a getAuthState callback');
    }
  });
});
