import * as R from 'ramda';
import { RequestPermissions, TransformedPermissions, ApolloPermission } from './types';

const PERMISSIONS_PATH = {
  teamMember: ['system', 'environmentMember'],
  user: ['user'],
};

export const getPermissions = (data: RequestPermissions, type: 'teamMember' | 'user'): TransformedPermissions =>
  R.pipe(
    R.pathOr([], PERMISSIONS_PATH[type]),
    R.pipe(
      R.pathOr([], ['permissions', 'items']),
      R.groupBy<ApolloPermission>(R.prop('resourceType')),
      R.mapObjIndexed(R.indexBy<ApolloPermission>(R.prop('resource'))),
    ),
  )(data);

export const getRoles = (data: RequestPermissions, type: 'teamMember' | 'user'): string[] =>
  R.pipe(
    R.pathOr([], [...PERMISSIONS_PATH[type], 'roles', 'items']),
    R.map(({ name }) => name),
  )(data);
