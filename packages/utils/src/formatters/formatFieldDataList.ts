import * as R from 'ramda';

import { MUTATION_TYPE } from '../constants';
import { formatFieldDataListItem } from './formatFieldDataListItem';

import { MutationType, FieldSchema, Schema } from '../types';

interface IFormatFieldDataListArgs {
  type: MutationType,
  fieldSchema: FieldSchema,
  data: any,
  schema: Schema
}

export const formatFieldDataList = ({ type, fieldSchema, data, schema }: IFormatFieldDataListArgs) =>
  R.pipe(
    R.map(item => formatFieldDataListItem(type, fieldSchema, item, schema)),
    R.groupBy(R.prop('type')),
    R.mapObjIndexed(R.map(R.prop('data'))),
    R.when(
      R.allPass([R.complement(R.has('reconnect')), R.always(R.equals(type, MUTATION_TYPE.UPDATE))]),
      R.assoc('reconnect', []),
    ),
  )(data);
