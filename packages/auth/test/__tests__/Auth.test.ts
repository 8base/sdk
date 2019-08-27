import { IStorage } from '@8base/utils';
import { WebAuth0AuthClient } from '@8base/web-auth0-auth-client';
import { ApiTokenAuthClient } from '@8base/api-token-auth-client';

import { Auth } from '../../src';

const authState = {};

const authStorage: IStorage = {
  getItem: jest.fn(key => Reflect.get(authState, key)),
  setItem: jest.fn((key, value) => {
    Reflect.set(authState, key, value);
  }),
  removeItem: jest.fn(key => {
    Reflect.deleteProperty(authState, key);
  }),
};

describe('Auth.createClient', () => {
  it('creates WebAuth0AuthClient', () => {
    const authClient = Auth.createClient(
      {
        strategy: 'web_auth0',
      },
      {
        domain: 'domain',
        clientId: 'clientId',
        redirectUri: 'redirectUri',
      },
    );

    expect(authClient).toBeInstanceOf(WebAuth0AuthClient);
  });

  it("creates WebAuth0AuthClient for 'web-8base' strategy", () => {
    const authClient = Auth.createClient(
      {
        strategy: 'web_8base',
      },
      {
        domain: 'domain',
        clientId: 'clientId',
        redirectUri: 'redirectUri',
      },
    );

    expect(authClient).toBeInstanceOf(WebAuth0AuthClient);
  });

  it('creates ApiTokenAuthClient', () => {
    const authClient = Auth.createClient(
      {
        strategy: 'api_token',
      },
      {
        apiToken: 'apiToken',
      },
    );

    expect(authClient).toBeInstanceOf(ApiTokenAuthClient);
  });

  it('creates AuthClient with custom storage and storageKey', () => {
    const authClient = Auth.createClient(
      {
        strategy: 'api_token',
        storage: authStorage,
        storageKey: 'anotherAuth',
      },
      {
        apiToken: 'apiToken',
      },
    );

    authClient.setState({
      someArgument: 'someArgument',
    });

    expect(authStorage.setItem).toHaveBeenCalledWith(
      'anotherAuth',
      JSON.stringify({
        token: 'apiToken',
        someArgument: 'someArgument',
      }),
    );
  });

  it('creates subscribable AuthClient', () => {
    const authClient = Auth.createClient(
      {
        strategy: 'api_token',
        subscribable: true,
      },
      {
        apiToken: 'apiToken',
      },
    );

    expect(authClient).toHaveProperty('subscribe');
    expect(authClient).toHaveProperty('notify');
    expect(authClient).toHaveProperty('batch');
  });
});
