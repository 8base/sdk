import * as R from 'ramda';
import {
  IAuthClient,
  IAuthState,
  ISubscriber,
  IPublisher,
  Publisher,
  SDKError,
  ERROR_CODES,
  PACKAGES,
} from '@8base/utils';

export interface ISubscribableAuthClient extends IAuthClient, IPublisher {}

export class SubscribableDecorator {
  public static hasConflicts(authClient: IAuthClient): boolean {
    return (
      Reflect.has(authClient, 'publisher') ||
      Reflect.has(authClient, 'subscribe') ||
      Reflect.has(authClient, 'notify') ||
      Reflect.has(authClient, 'batch')
    );
  }

  public static decorate(authClient: IAuthClient): ISubscribableAuthClient {
    if (SubscribableDecorator.hasConflicts(authClient)) {
      throw new SDKError(
        ERROR_CODES.PROPERTY_CONFLICT,
        PACKAGES.AUTH,
        "authClient has property conflict, it shouldn't have 'publisher', 'subscribe', 'notify' and 'batch' properties",
      );
    }

    const decoratedAuthClient = {
      publisher: new Publisher<IAuthState>(),
      subscribe(subscriber: ISubscriber) {
        return this.publisher.subscribe(subscriber);
      },
      notify(state: IAuthState) {
        this.publisher.notify(state);
      },
      batch(fn: () => void) {
        this.publisher.batch(fn);
      },
      setState(state: IAuthState) {
        super.setState(state);

        // @ts-ignore
        const newState = this.getState();

        this.notify(newState);
      },
      purgeState() {
        super.purgeState();

        // @ts-ignore
        const newState = this.getState();

        this.notify(newState);
      },
    };

    Object.setPrototypeOf(decoratedAuthClient, authClient);

    // @ts-ignore
    return decoratedAuthClient;
  }
}
