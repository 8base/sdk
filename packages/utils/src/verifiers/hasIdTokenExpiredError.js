import * as R from 'ramda';
import * as errorCodes from '@8base/error-codes';

export const hasIdTokenExpiredError = R.any(R.allPass([
  R.propEq('code', errorCodes.TokenExpiredErrorCode),
  R.propEq('message', 'Token expired'),
]));
