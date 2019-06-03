import { TableSchema } from '@8base/utils';

export type TableSchemaResponse = {
  tablesList: {
    items: TableSchema[],
  }
}
