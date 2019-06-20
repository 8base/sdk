import * as R from 'ramda';

import { MUTATION_TYPE } from '../constants';
import { formatFieldDataListItem } from './formatFieldDataListItem';

import { MutationType, FieldSchema, Schema } from '../types';

interface IFormatFieldDataListMeta {
  fieldSchema: FieldSchema;
  schema: Schema;
}

export const formatFieldDataList = (type: MutationType, data: any, { fieldSchema, schema }: IFormatFieldDataListMeta) =>
  R.pipe(
    R.map(item => formatFieldDataListItem(type, item, { fieldSchema, schema })),
    R.groupBy(R.prop('type')),
    R.mapObjIndexed(R.map(R.prop('data'))),
    R.when(
      R.allPass([R.complement(R.has('reconnect')), R.always(R.equals(type, MUTATION_TYPE.UPDATE))]),
      R.assoc('reconnect', []),
    ),
  )(data);
