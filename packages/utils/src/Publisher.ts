import * as R from 'ramda';
import { Unsubscribe, ISubscriber, IPublisher } from './types';

export class Publisher<T> implements IPublisher {
  private subscribers: ISubscriber[];
  private inBatch: boolean;
  private pendingState: T | null;

  constructor() {
    this.subscribers = [];
    this.inBatch = false;
    this.pendingState = null;
  }

  public subscribe(subscriber: ISubscriber): Unsubscribe {
    if (!this.subscribers.includes(subscriber)) {
      this.subscribers = [...this.subscribers, subscriber];
    }

    return () => {
      const subscriberIndex = this.subscribers.indexOf(subscriber);

      if (subscriberIndex >= 0) {
        this.subscribers = R.remove(subscriberIndex, 1, this.subscribers);
      }
    };
  }

  public notify(state: T): void {
    if (this.inBatch) {
      this.pendingState = state;
      return;
    }

    this.subscribers.forEach(subscriber => {
      subscriber(state);
    });
  }

  public batch(fn: () => void): void {
    this.inBatch = true;
    fn();
    this.inBatch = false;

    if (this.pendingState !== null) {
      this.notify(this.pendingState);
      this.pendingState = null;
    }
  }
}
