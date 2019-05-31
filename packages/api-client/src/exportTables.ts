// @flow
import { DocumentNode } from 'graphql';
import { TableSchema } from '@8base/utils';

import { TABLES_LIST_QUERY } from './constants';
import { TableSchemaResponse } from './types';

type ExportTablesConfig = {
  withSystemTables?: boolean
}

export const exportTables =
  async (request: <T extends object>(query: string | DocumentNode, variables?: Object) => Promise<T>, config: ExportTablesConfig = {}) => {
    const variables = config.withSystemTables
      ? {}
      : {
        filter: {
          onlyUserTables: true,
        },
      };

    const tablesListData = await request<TableSchemaResponse>(TABLES_LIST_QUERY, variables);

    return tablesListData.tablesList.items;
  };
