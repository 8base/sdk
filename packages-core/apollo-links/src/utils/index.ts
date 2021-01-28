import * as R from 'ramda';
import errorCodes from '@8base/error-codes';

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
