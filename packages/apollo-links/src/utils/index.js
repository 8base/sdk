//@flow
import * as R from 'ramda';
import * as errorCodes from '@8base/error-codes';

export const hasTokenExpiredError = R.any(R.anyPass([
  R.propEq('code', errorCodes.TokenExpiredErrorCode),
  R.propEq('message', 'jwt expired'),
]));

export const hasTokenInvalidError = R.any(R.propEq('code', errorCodes.InvalidTokenErrorCode));

