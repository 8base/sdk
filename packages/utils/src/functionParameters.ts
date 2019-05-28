// @flow
import * as R from 'ramda';

const hasOption: (string | Array<string>) => ({}) => boolean = R.ifElse(
  R.is(String),
  R.has,
  R.hasPath,
);

const stringifyPath: (string | Array<string>) => string = R.ifElse(
  R.is(String),
  (path) => path,
  R.join('.'),
);

export const throwIfMissing = (paramName: string): void => {
  throw new Error(`Missing parameter: ${paramName}`);
};

export const throwIfMissingRequiredOption = (
  requiredOptionPaths: Array<Array<string> | string>,
  options: {},
): void => {
  requiredOptionPaths.forEach(optionPath => {
    const isMissing = !hasOption(optionPath)(options);

    if (isMissing) {
      throw new Error(`Missing option: ${stringifyPath(optionPath)}`);
    }
  });
};

