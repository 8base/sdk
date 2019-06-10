import { DocumentNode } from 'graphql';
import R from 'ramda';

import { importData } from './importData';
import { importTables } from './importTables';

export const importWorkspace = async (
  request: <T extends object>(query: string | DocumentNode, variables?: object) => Promise<T>,
  workspace: object,
) => {
  await importTables(request, R.propOr({}, 'tables', workspace));
  await importData(request, R.propOr({}, 'data', workspace));
};
