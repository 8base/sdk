// @flow

import {
  ApolloLink,
  Observable,
  Operation,
  NextLink,
  FetchResult,
} from 'apollo-link';

type SuccessHandler = ({ operation: Operation }) => void;

type SuccessLinkParameters = {
  successHandler: SuccessHandler,
};

export class SuccessLink extends ApolloLink {
  constructor({ successHandler }: SuccessLinkParameters) {
    super();

    this.successHandler = successHandler;
  }

  request(operation: Operation, forward: NextLink): Observable<FetchResult> {
    return new Observable(
      observer => {
        forward(operation).subscribe({
          next: (...args) => {
            this.successHandler({ operation });
            observer.next(...args);
          },
          error: (...args) => observer.error(...args),
          complete: (...args) => observer.complete(...args),
        });
      },
    );
  }
}
