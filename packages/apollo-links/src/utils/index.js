//@flow
import * as R from 'ramda';
import * as errorCodes from '@8base/error-codes';

export const hasIdTokenExpiredError = R.any(R.where({
  code: R.equals(errorCodes.TokenExpiredErrorCode),
  details: R.has('idToken'),
}));

export const hasRefreshTokenExpiredError = R.any(R.where({
  code: R.equals(errorCodes.TokenExpiredErrorCode),
  details: R.has('refreshToken'),
}));


