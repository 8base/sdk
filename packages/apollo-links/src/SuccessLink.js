// @flow

import { not, has } from 'ramda';
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
          next: (data) => {
            if (not(has('errors', data))) {
              this.successHandler({ operation, data });
            }

            observer.next(data);
          },
          error: (...args) => observer.error(...args),
          complete: (...args) => observer.complete(...args),
        });
      },
    );
  }
}
