import { IAuthClient, IStorage, throwIfMissingRequiredParameters, PACKAGES } from '@8base/utils';
import { WebAuth0AuthClient } from '@8base/web-auth0-auth-client';
import { ApiTokenAuthClient } from '@8base/api-token-auth-client';

import { AUTH_STRATEGIES } from './constants';
import { SubscribableDecorator } from './SubscribableDecorator';

interface IAuthClientCreateOptions {
  strategy: AUTH_STRATEGIES | string;
  storage?: IStorage;
  storageKey?: string;
  subscribable?: boolean;
}

const getAuthClientConstructor = (strategy: AUTH_STRATEGIES | string): any => {
  switch (strategy) {
    case AUTH_STRATEGIES.API_TOKEN: {
      return ApiTokenAuthClient;
    }
    case AUTH_STRATEGIES.WEB_8BASE:
    case AUTH_STRATEGIES.WEB_AUTH0: {
      return WebAuth0AuthClient;
    }
  }
};

export class Auth {
  public static createClient(options: IAuthClientCreateOptions, clientOptions: any): IAuthClient {
    throwIfMissingRequiredParameters(['strategy'], PACKAGES.AUTH, options);

    const { strategy, storage, storageKey, subscribable } = options;

    const Constructor = getAuthClientConstructor(strategy);

    let authClient: IAuthClient = new Constructor(clientOptions, storage, storageKey);

    if (subscribable) {
      authClient = SubscribableDecorator.decorate(authClient);
    }

    return authClient;
  }
}
