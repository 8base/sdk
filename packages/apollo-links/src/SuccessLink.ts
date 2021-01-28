import { not, has } from 'ramda';
import { ApolloLink, Observable, Operation, NextLink, FetchResult } from '@apollo/client';

type SuccessHandler = (options: { operation: Operation; data: any }) => void;

type SuccessLinkParameters = {
  successHandler: SuccessHandler;
};

export class SuccessLink extends ApolloLink {
  public successHandler: SuccessHandler;

  constructor({ successHandler }: SuccessLinkParameters) {
    super();

    this.successHandler = successHandler;
  }

  public request(operation: Operation, forward: NextLink): Observable<FetchResult> {
    return new Observable(observer => {
      forward(operation).subscribe({
        complete: (...args) => observer.complete(...args),
        error: (...args) => observer.error(...args),
        next: data => {
          if (not(has('errors', data))) {
            this.successHandler({ operation, data });
          }

          observer.next(data);
        },
      });
    });
  }
}
