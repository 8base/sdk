import * as R from 'ramda';
import { RequestPermissions, TransformedPermissions, ApolloPermission } from './types';

export const getPermissions = (data: RequestPermissions, type: string): TransformedPermissions =>
  R.pipe(
    R.pathOr([], [type]),
    R.pipe(
      R.pathOr([], ['permissions', 'items']),
      R.groupBy<ApolloPermission>(R.prop('resourceType')),
      R.mapObjIndexed(R.indexBy<ApolloPermission>(R.prop('resource'))),
    ),
  )(data);
