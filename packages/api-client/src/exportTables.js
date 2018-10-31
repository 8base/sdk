// @flow
import type { DocumentNode } from 'graphql';

import { TABLES_LIST_QUERY } from './constants';

export const exportTables = async (request: (query: string | DocumentNode, variables?: Object) => Promise<Object>) => {
  const tablesListData = await request(TABLES_LIST_QUERY, {
    filter: {
      onlyUserTables: true,
    },
  });

  return tablesListData.tablesList.items;
};
