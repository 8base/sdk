import {
  IAuthClient,
  IStorage,
  throwIfMissingRequiredParameters,
  showWarningIfDeprecatedParameters,
  PACKAGES,
} from '@8base/utils';
import { WebAuth0AuthClient } from '@8base/web-auth0-auth-client';
import { WebNativeAuthClient } from '@8base/web-native-auth-client';
import { WebCognitoAuthClient } from '@8base/web-cognito-auth-client';
import { WebOAuthClient } from '@8base/web-oauth-client';
import { ApiTokenAuthClient } from '@8base/api-token-auth-client';

import { AUTH_STRATEGIES } from './constants';
import { SubscribableDecorator } from './SubscribableDecorator';

interface IAuthClientCreateOptions {
  strategy: AUTH_STRATEGIES | string;
  storageOptions?: {
    storage?: IStorage;
    storageKey?: string;
    initialState?: Object;
  };
  subscribable?: boolean;
}

const getAuthClientConstructor = (strategy: AUTH_STRATEGIES | string): any => {
  switch (strategy) {
    case AUTH_STRATEGIES.API_TOKEN: {
      return ApiTokenAuthClient;
    }
    case AUTH_STRATEGIES.WEB_8BASE:
    case AUTH_STRATEGIES.WEB_8BASE_AUTH0:
    case AUTH_STRATEGIES.WEB_AUTH0: {
      return WebAuth0AuthClient;
    }
    case AUTH_STRATEGIES.WEB_OAUTH: {
      return WebOAuthClient;
    }
    case AUTH_STRATEGIES.WEB_8BASE_COGNITO:
    case AUTH_STRATEGIES.WEB_COGNITO: {
      return WebCognitoAuthClient;
    }
    case AUTH_STRATEGIES.WEB_8BASE_NATIVE: {
      return WebNativeAuthClient;
    }
  }
};

export class Auth {
  public static createClient(options: IAuthClientCreateOptions, clientOptions: any): IAuthClient {
    throwIfMissingRequiredParameters(['strategy'], PACKAGES.AUTH, options);
    showWarningIfDeprecatedParameters(['storage', 'storageKey'], PACKAGES.AUTH, options);

    const { strategy, subscribable } = options;

    const storageOptions = !!options.storageOptions
      ? options.storageOptions
      : {
          // @ts-ignore
          storage: options.storage,
          // @ts-ignore
          storageKey: options.storageKey,
        };

    const Constructor = getAuthClientConstructor(strategy);

    let authClient: IAuthClient = new Constructor(clientOptions, storageOptions);

    if (subscribable) {
      authClient = SubscribableDecorator.decorate(authClient);
    }

    return authClient;
  }
}
