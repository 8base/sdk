import { TableSchema } from '@8base/utils';
import * as filestack from 'filestack-js';

export type SchemaResponse = {
  tablesList: {
    items: TableSchema[];
  };
};

export type FileUploadInfoResponse = {
  policy: string;
  signature: string;
  apiKey: string;
  path: string;
};

export type FilestackClient = ReturnType<typeof filestack.init>;
