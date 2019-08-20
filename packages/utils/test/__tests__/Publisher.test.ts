import { Publisher, Unsubscribe } from '../../src';

describe('Publisher', () => {
  const publisher = new Publisher();
  const firstSubscriber = jest.fn();
  const secondSubscriber = jest.fn();
  let firstUnsubscribe: Unsubscribe | null = null;
  let secondUnsubscribe: Unsubscribe | null = null;

  afterEach(() => {
    jest.clearAllMocks();

    if (firstUnsubscribe) {
      firstUnsubscribe();
      firstUnsubscribe = null;
    }

    if (secondUnsubscribe) {
      secondUnsubscribe();
      secondUnsubscribe = null;
    }
  });

  it('As a developer, I can subscribe to publisher', () => {
    firstUnsubscribe = publisher.subscribe(firstSubscriber);

    publisher.notify('state');

    expect(firstSubscriber).toHaveBeenCalledWith('state');
  });

  it('As a developer, I can add multiple subsribers', () => {
    firstUnsubscribe = publisher.subscribe(firstSubscriber);
    secondUnsubscribe = publisher.subscribe(secondSubscriber);

    publisher.notify('newState');

    expect(firstSubscriber).toHaveBeenCalledTimes(1);
    expect(firstSubscriber).toHaveBeenCalledWith('newState');
    expect(secondSubscriber).toHaveBeenCalledWith('newState');
  });

  it('As a developer, I can unsubscribe from publisher', () => {
    firstUnsubscribe = publisher.subscribe(firstSubscriber);

    firstUnsubscribe();

    publisher.notify('anotherState');

    expect(firstSubscriber).not.toHaveBeenCalled();
  });

  it('As a developer, I can batch updates', () => {
    firstUnsubscribe = publisher.subscribe(firstSubscriber);
    secondUnsubscribe = publisher.subscribe(secondSubscriber);

    publisher.batch(() => {
      publisher.notify('someTempState');
      publisher.notify('yetAnotherState');
    });

    expect(firstSubscriber).toHaveBeenCalledTimes(1);
    expect(firstSubscriber).toHaveBeenCalledWith('yetAnotherState');
    expect(secondSubscriber).toHaveBeenCalledTimes(1);
    expect(secondSubscriber).toHaveBeenCalledWith('yetAnotherState');
  });
});
