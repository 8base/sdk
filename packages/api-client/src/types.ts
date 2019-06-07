import { TableSchema } from '@8base/utils';

export type SchemaResponse = {
  tablesList: {
    items: TableSchema[],
  }
}
