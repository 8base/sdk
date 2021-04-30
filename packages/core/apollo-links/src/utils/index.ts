import * as R from 'ramda';
import errorCodes from '@8base/error-codes';
import { DocumentNode } from 'graphql';
import { getMainDefinition } from '@apollo/client/utilities';

export const isIdTokenExpiredError = R.allPass([
  R.propEq('code', errorCodes.TokenExpiredErrorCode),
  R.propEq('message', 'Token expired'),
]);

export const hasIdTokenExpiredError = R.any(isIdTokenExpiredError);

export const hasTokenInvalidError = R.any(R.propEq('code', errorCodes.InvalidTokenErrorCode));

export const isRefreshTokenExpiredError = R.allPass([
  R.propEq('code', errorCodes.TokenExpiredErrorCode),
  R.propEq('message', 'Refresh Token has expired'),
]);

export const hasRefreshTokenExpiredError = R.any(isRefreshTokenExpiredError);

export const hasUserNotFoundError = R.any(R.propEq('code', errorCodes.EntityNotFoundErrorCode));

export const isSubscriptionRequest = ({ query }: { query: DocumentNode }) => {
  const definition = getMainDefinition(query);

  return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
};
