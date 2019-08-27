import * as R from 'ramda';
import { SDKError } from './SDKError';
import { ERROR_CODES } from './codes';
import { PACKAGES } from './packages';

const hasParameter = R.ifElse(R.is(String), R.has, R.hasPath);

const stringifyPath = R.ifElse(R.is(String), path => path, R.join('.'));

export const throwIfMissingRequiredParameters = (
  requiredParameterPaths: Array<string[] | string>,
  packageName: PACKAGES,
  parameters: {} = {},
): void => {
  requiredParameterPaths.forEach(parameterPath => {
    const isMissing = !hasParameter(parameterPath)(parameters);

    if (isMissing) {
      throw new SDKError(
        ERROR_CODES.MISSING_PARAMETER,
        packageName,
        `Missing parameter: ${stringifyPath(parameterPath)}`,
      );
    }
  });
};
