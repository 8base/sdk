// @flow

import {
  ApolloLink,
  Observable,
  FetchResult,
  Operation,
  NextLink,
  GraphQLRequest,
  createOperation,
} from 'apollo-link';
import * as R from 'ramda';

import {
  createFile,
  type CreatedFile,
} from './utils/createFile';

type Path = Array<number | string>;

/**
 * 10 deep where related objects are in { field: { create: { $file} } -
 * that's why "multiply 3". I think we can calibrate this when we start using it more
 */
export const MAX_OBJECT_DEPTH = 10 * 3;

export const FILE_PROP = '$file';

/**
 * To reduce the number of partial presentations of operation.variables
 * I use ramda's paths.
 * Number in a path array stands for array indecies
 * See https://github.com/ramda/ramda/issues/2543#issuecomment-392053756
 * But flow typings don't support this feature. So there are $FlowFixMe comments.
 * I will create PR to flow-typed soon with fix for this feature soon.
 */

const checkIsFile = (path: Path, variables: {}): boolean => R.and(
  // $FlowFixMe
  R.pathSatisfies(
    R.is(File),
    path,
  )(variables),
  R.pipe(
    R.last,
    R.equals(FILE_PROP),
  )(path),
);

const checkIsObject = (path: Path, variables: {}): boolean => R.pathSatisfies(
  R.is(Object),
  path,
)(variables);

const checkIsArray = (path: Path, variables: {}) => R.pathSatisfies(
  R.is(Array),
  path,
)(variables);

const findFilePathsDeep = (
  path: Path,
  depth: number,
  variables: {},
): Array<Path> => R.pipe(
  // $FlowFixMe
  R.path(path),
  R.keys,
  R.reduce(
    (fileFieldPaths: Array<Path>, currentFieldKey: string): Array<Path> => {
      /**
       * Number in a path array stands for array indecies
       * See https://github.com/ramda/ramda/issues/2543#issuecomment-392053756
       */
      const currentFieldPath: Path = checkIsArray(path, variables) ?
        [...path, Number(currentFieldKey)] :
        [...path, currentFieldKey];

      if (depth > MAX_OBJECT_DEPTH) {
        return fileFieldPaths;
      }

      if (checkIsFile(currentFieldPath, variables)) {
        return [
          ...fileFieldPaths,
          currentFieldPath,
        ];
      }

      if (checkIsObject(currentFieldPath, variables) || checkIsArray(currentFieldPath, variables)) {
        return [
          ...fileFieldPaths,
          ...findFilePathsDeep(currentFieldPath, depth + 1, variables),
        ];
      }

      return fileFieldPaths;
    },
    [],
  ),
)(variables);

export const findFilePaths = (variables: {}): Array<Path> => findFilePathsDeep([], 1, variables);

export const getFiles = (filePaths: Array<Path>, variables: {}): Array<File> => R.converge(
  R.unapply(R.identity),
  // $FlowFixMe
  R.map(R.path, filePaths),
)(variables);

export const dissocFileProps = (filePaths: Array<Path>, variables: {}): {} => R.apply(
  R.pipe,
  // $FlowFixMe
  R.map(R.dissocPath)(filePaths),
)(variables);

export const createFiles = (
  files: Array<File>,
  fileFieldPaths: Array<Path>,
  variables: {},
  mutate: (any) => any,
): Promise<Array<CreatedFile>> => {
  const fileAndFileFieldPairs = R.zip(
    R.map(
      // $FlowFixMe
      (fileFieldPath) => R.path(fileFieldPath, variables),
      fileFieldPaths,
    ),
    files,
  );

  return Promise.all(
    R.map(
      ([fileField, file]) => createFile(
        {
          file,
          fileMeta: fileField,
        },
        mutate,
      ),
    )(fileAndFileFieldPairs),
  );
};

export const replaceLastCreatePropByConnectProp = (fileFieldPath: Path): Path => {
  const createPropIndex = R.lastIndexOf('create', fileFieldPath);

  return R.update(createPropIndex, 'connect', fileFieldPath);
};

/**
 * There are two types of 'create' field:
 * 1. 'create' as an object that consist a field { create: { field }}
 * 2. 'create' as a list of fields { create: [ field, field ]}
 * For the first case we assume that 'create' is the last prop in a path: [ 'prop1', 'prop2', 'create' ].
 * For the second case we must to look one prop back in a path: [ 'prop1', 'prop2', 'create', 0 ]
 */
export const assocConnectFieldsWithFileIds = (
  fileFieldPaths: Array<Path>,
  createdFiles: Array<CreatedFile>,
  variables: {},
): {} => R.apply(
  R.pipe,
  R.pipe(
    R.map(replaceLastCreatePropByConnectProp),
    R.zip(createdFiles),
    R.map(
      // $FlowFixMe
      ([fileLink, fileFieldPath]) => R.assocPath([...fileFieldPath, 'id'], fileLink.id),
    ),
  )(fileFieldPaths),
)(variables);

export const dissocCreateFields = (fileFieldPaths: Array<Path>, variables: {}): {} => R.apply(
  R.pipe,
  // $FlowFixMe
  R.map(
    R.pipe(
      (fileFieldPath) => R.slice(
        0,
        R.lastIndexOf('create', fileFieldPath) + 1,
        fileFieldPath,
      ),
      R.dissocPath,
    ),
  )(fileFieldPaths),
)(variables);

const forwardOperation = (operation: Operation, forward: NextLink, observer: *) => {
  forward(operation).subscribe({
    error: (...args) => {
      observer.error(...args);
    },
    next: (...args) => {
      observer.next(...args);
    },
    complete: (...args) => {
      observer.complete(...args);
    },
  });
};

export class FileUploadLink extends ApolloLink {
  request(operation: Operation, forward: NextLink): Observable<FetchResult> {
    return new Observable(observer => {
      const filePaths: Array<Path> = findFilePaths(operation.variables);

      if (filePaths.length === 0) {
        forwardOperation(operation, forward, observer);
        return;
      }

      const fileFieldPaths: Array<Path> = R.map(R.init, filePaths);
      const files: Array<File> = getFiles(filePaths, operation.variables);
      const mutate = (req: GraphQLRequest) => forward(createOperation(operation.getContext(), req));

      operation.variables = dissocFileProps(filePaths, operation.variables);

      createFiles(files, fileFieldPaths, operation.variables, mutate)
        .then((createdFiles: Array<CreatedFile>) => {
          operation.variables = assocConnectFieldsWithFileIds(fileFieldPaths, createdFiles, operation.variables);
          operation.variables = dissocCreateFields(fileFieldPaths, operation.variables);
        })
        .then(() => {
          forwardOperation(operation, forward, observer);
        })
        .catch((...args) => {
          observer.error(...args);
        });
    });
  }
}

