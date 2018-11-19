// @flow
import type { DocumentNode } from 'graphql';

import { importData } from './importData';
import { importTables } from './importTables';

export const importWorkspace = async (request: (query: string | DocumentNode, variables?: Object) => Promise<Object>, workspace: Object) => {
  await importTables(request, workspace.tables);
  await importData(request, workspace.data);
};
