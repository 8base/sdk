// @flow
import type { DocumentNode } from 'graphql';
import * as R from 'ramda';

import { importData } from './importData';
import { importTables } from './importTables';

export const importWorkspace = async (request: (query: string | DocumentNode, variables?: Object) => Promise<Object>, workspace: Object) => {
  await importTables(request, R.propOr({}, 'tables', workspace));
  await importData(request, R.propOr({}, 'data', workspace));
};
