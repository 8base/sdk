import * as R from 'ramda';
import { SDKError } from './SDKError';
import { ERROR_CODES } from './codes';
import { PACKAGES } from './packages';

const hasParameter = R.ifElse(R.is(String), R.has, R.hasPath);

const stringifyPath = R.ifElse(R.is(String), path => path, R.join('.'));

type ParameterPathType = string[] | string

export const throwIfMissingRequiredParameters = (
  requiredParameterPaths: ParameterPathType[],
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

export const showWarningIfDeprecatedParameters = (
  deprecatedParameterPaths: ParameterPathType[],
  packageName: PACKAGES,
  parameters: {} = {},
): void => {
  deprecatedParameterPaths.forEach(parameterPath => {
    const isExist = hasParameter(parameterPath)(parameters);

    if (isExist) {
      // tslint:disable-next-line:no-console
      console.warn(
        `Deprecated parameter: ${stringifyPath(
          parameterPath,
        )}. Please, replace it with appropriate API https://www.npmjs.com/package/${packageName}`,
      );
    }
  });
};
