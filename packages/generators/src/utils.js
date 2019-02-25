// @flow
import * as R from 'ramda';

export const isFieldNeedsToInclude = (fieldName: string, includeColumns?: string[]) => {
  const firstLevelColumns = includeColumns && includeColumns.map(column => column.split('.')[0]);

  const needsInclude = firstLevelColumns
    ? R.contains(fieldName, firstLevelColumns)
    : true;

  return needsInclude;
};

