import { DocumentNode } from 'graphql';

import { TABLES_LIST_QUERY } from './constants';
import { SchemaResponse } from './types';

type ExportTablesConfig = {
  withSystemTables?: boolean;
};

export const exportTables = async (
  request: <T extends object>(query: string | DocumentNode, variables?: object) => Promise<T>,
  config: ExportTablesConfig = {},
) => {
  const variables = config.withSystemTables
    ? {}
    : {
        filter: {
          onlyUserTables: true,
        },
      };

  const tablesListData = await request<SchemaResponse>(TABLES_LIST_QUERY, variables);

  return tablesListData.tablesList.items;
};
