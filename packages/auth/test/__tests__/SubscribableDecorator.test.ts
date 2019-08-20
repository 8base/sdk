import { IAuthClient, IStorage, StorageAPI, IAuthState, Unsubscribe } from '@8base/utils';

import { SubscribableDecorator } from '../../src';

const authState = {};

const externalAuth = {
  login: jest.fn(() => ({ token: 'some-token' })),
  logout: jest.fn(() => ({ token: null })),
};

const authStorage: IStorage = {
  getItem: key => Reflect.get(authState, key),
  setItem: (key, value) => {
    Reflect.set(authState, key, value);
  },
  removeItem: key => {
    Reflect.deleteProperty(authState, key);
  },
};

class DummyAuthClient implements IAuthClient {
  private storageAPI: StorageAPI<IAuthState>;
  private externalAuth: typeof externalAuth;

  constructor() {
    this.storageAPI = new StorageAPI<IAuthState>(authStorage, 'auth');
    this.externalAuth = externalAuth;
  }

  public getState() {
    return this.storageAPI.getState();
  }

  public setState(newState: IAuthState) {
    this.storageAPI.setState(newState);
  }

  public purgeState() {
    this.storageAPI.purgeState();
  }

  public checkIsAuthorized() {
    const state = this.getState();

    return !!state.token;
  }

  public login() {
    return this.externalAuth.login();
  }

  public logout() {
    return this.externalAuth.logout();
  }
}

describe('SubscribableDecorator', () => {
  const dummyAuthClient = new DummyAuthClient();
  const decoratedDummyAuthClient = SubscribableDecorator.decorate(dummyAuthClient);
  const subscriber = jest.fn();
  let unsubscribe: Unsubscribe | null = null;

  afterEach(() => {
    jest.clearAllMocks();

    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  });

  it("Throws an error if authClient already has one of decorator's properties", () => {
    const dummyAuthClient = new DummyAuthClient();

    // @ts-ignore
    dummyAuthClient.subscribe = () => {
      return null;
    };

    expect(() => {
      const temp = SubscribableDecorator.decorate(dummyAuthClient);
    }).toThrow();
  });

  it('As a developer, I can subscribe to auth state changes', () => {
    unsubscribe = decoratedDummyAuthClient.subscribe(subscriber);

    decoratedDummyAuthClient.setState({
      token: 'first-token',
    });

    decoratedDummyAuthClient.purgeState();

    expect(subscriber).toHaveBeenCalledTimes(2);
    expect(subscriber).toHaveBeenNthCalledWith(1, { token: 'first-token' });
    expect(subscriber).toHaveBeenNthCalledWith(2, {});
  });

  it('As a developer, I can batch updates', () => {
    unsubscribe = decoratedDummyAuthClient.subscribe(subscriber);

    decoratedDummyAuthClient.batch(() => {
      decoratedDummyAuthClient.setState({
        foo: 'foo',
      });

      decoratedDummyAuthClient.setState({
        bar: 'bar',
      });
    });

    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber).toHaveBeenCalledWith({
      foo: 'foo',
      bar: 'bar',
    });
  });

  it('As a developer, I can notify subscribers about new state', () => {
    unsubscribe = decoratedDummyAuthClient.subscribe(subscriber);

    decoratedDummyAuthClient.notify({
      isFake: true,
    });

    expect(subscriber).toHaveBeenCalledWith({
      isFake: true,
    });
  });

  it('As a developer, I can run external methods', () => {
    decoratedDummyAuthClient.login();
    decoratedDummyAuthClient.logout();

    expect(externalAuth.login).toHaveBeenCalled();
    expect(externalAuth.logout).toHaveBeenCalled();
  });
});
