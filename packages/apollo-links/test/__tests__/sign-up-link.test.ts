import { ApolloLink, execute, Observable, Operation, RequestHandler } from 'apollo-link';
import gql from 'graphql-tag';
import errorCodes from '@8base/error-codes';

import { SignUpLink } from '../../src';
import { SIGNUP_MUTATION } from '../../src//graphql/mutations';

const DYNO_QUERY = gql`
  query {
    sample {
      success
    }
  }
`;

const AUTH_PROFILE_ID = 'someProfileId';
const USER_EMAIL = 'test@gmail.com';

describe('As a developer, I can use sign up link to register new users.', () => {
  let getAuthState: any = null;
  let signUpLink: any = null;
  let stubRequestHandler: any = null;
  let mergedLink: any = null;

  beforeEach(() => {
    getAuthState = jest.fn().mockReturnValue({
      email: USER_EMAIL,
    });

    signUpLink = new SignUpLink({
      getAuthState,
      authProfileId: AUTH_PROFILE_ID,
    });

    stubRequestHandler = jest.fn(operation =>
      Observable.of({
        data: {
          sample: {
            success: true,
          },
        },
      }),
    );

    mergedLink = ApolloLink.from([signUpLink, stubRequestHandler]);
  });

  it('As a developer, I can use sign up link to register new users', () => {
    stubRequestHandler
      .mockReturnValueOnce(
        Observable.of({
          errors: [
            {
              code: errorCodes.EntityNotFoundErrorCode,
            },
          ],
        }),
      )
      .mockReturnValueOnce(
        Observable.of({
          data: {
            userSignUp: {
              id: 'someUserId',
            },
          },
        }),
      );

    return new Promise((resolve, reject) => {
      execute(mergedLink, { query: DYNO_QUERY }).subscribe(
        data => {
          expect(data).toEqual({
            data: {
              sample: {
                success: true,
              },
            },
          });
        },
        reject,
        () => {
          expect(getAuthState).toHaveBeenCalledTimes(1);
          expect(stubRequestHandler).toHaveBeenCalledTimes(3);

          expect(stubRequestHandler.mock.calls[0][0]).toMatchObject({
            query: DYNO_QUERY,
          });

          expect(stubRequestHandler.mock.calls[1][0]).toMatchObject({
            query: SIGNUP_MUTATION,
            variables: {
              authProfileId: AUTH_PROFILE_ID,
              user: {
                email: USER_EMAIL,
              },
            },
          });

          expect(stubRequestHandler.mock.calls[2][0]).toMatchObject({
            query: DYNO_QUERY,
          });

          resolve();
        },
      );
    });
  });

  it('Passess another errors', () => {
    stubRequestHandler.mockReturnValueOnce(
      Observable.of({
        errors: [
          {
            code: errorCodes.TokenExpiredErrorCode,
          },
        ],
      }),
    );

    return new Promise((resolve, reject) => {
      execute(mergedLink, { query: DYNO_QUERY }).subscribe(
        data => {
          expect(data).toEqual({
            errors: [
              {
                code: errorCodes.TokenExpiredErrorCode,
              },
            ],
          });
        },
        reject,
        () => {
          expect(getAuthState).toHaveBeenCalledTimes(0);
          expect(stubRequestHandler).toHaveBeenCalledTimes(1);

          expect(stubRequestHandler.mock.calls[0][0]).toMatchObject({
            query: DYNO_QUERY,
          });

          resolve();
        },
      );
    });
  });
});
