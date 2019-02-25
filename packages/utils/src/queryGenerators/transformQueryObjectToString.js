// @flow
import * as R from 'ramda';

type TransformQueryConfig = {
  prevSpaceCount?: number,
  spaceCount?: number,
  initSpaceCount?: number,
}

export const transformQueryObjectToString = (queryObject: Object, spacesParams: TransformQueryConfig) => {
  const { prevSpaceCount = 4, spaceCount = 2, initSpaceCount = 2 } = spacesParams || {};

  const queryString = Object.keys(queryObject).reduce(
    (accum, queryElement) => {
      const spaces = R.repeat(' ', prevSpaceCount + spaceCount).join('');

      if (typeof queryObject[queryElement] === 'object') {
        const innerObjectString = transformQueryObjectToString(
          queryObject[queryElement],
          { prevSpaceCount, initSpaceCount, spaceCount: initSpaceCount + spaceCount },
        );

        accum += `\n${spaces}${queryElement} {${innerObjectString}\n${spaces}}`;
      } else {
        accum += `\n${spaces}${queryObject[queryElement]}`;
      }

      return accum;
    },
    '',
  );

  return queryString;
};

