// @flow
import type { DocumentNode } from 'graphql';

import { TABLES_LIST_QUERY } from './constants';

type ExportTablesConfig = {
  withSystemTables?: boolean
}

export const exportTables =
  async (request: (query: string | DocumentNode, variables?: Object) => Promise<Object>, config: ExportTablesConfig = {}) => {
    const variables = config.withSystemTables
      ? {}
      : {
        filter: {
          onlyUserTables: true,
        },
      };

    const tablesListData = await request(TABLES_LIST_QUERY, variables);

    return tablesListData.tablesList.items;
  };
