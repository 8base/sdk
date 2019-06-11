import errorCodes from '@8base/error-codes';
import * as R from 'ramda';

export const hasIdTokenExpiredError = R.any(
  R.allPass([R.propEq('code', errorCodes.TokenExpiredErrorCode), R.propEq('message', 'Token expired')]),
);
