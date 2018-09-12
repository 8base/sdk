// @flow

import {
  ApolloLink,
  Observable,
  Operation,
  NextLink,
  FetchResult,
} from 'apollo-link';

export const onSuccess = (successHandler: ({ operation: Operation }) => void): ApolloLink => new ApolloLink(
  (operation: Operation, forward: NextLink): Observable<FetchResult> => new Observable(
    observer => {
      forward(operation).subscribe({
        next: (...args) => {
          successHandler({ operation });
          observer.next(...args);
        },
        error: (...args) => observer.error(...args),
        complete: (...args) => observer.complete(...args),
      });
    },
  ),
);
