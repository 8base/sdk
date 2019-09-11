import { WebSocketLink } from 'apollo-link-ws';

import { isIdTokenExpiredError, isRefreshTokenExpiredError } from './utils';

import { SubscriptionLinkParameters, AuthState } from './types';

/**
 * Subscription Link
 * @param {SubscriptionLinkParameters} options - The subscription link options.
 * @param {Function} options.uri - The uri which used for WebSocket connection.
 * @param {Function} [options.onAuthError] - The callback which called when attempt to refresh authentication is failed.
 * @param {Function} [options.onIdTokenExpired] - The callback which called when id token is expired.
 */
export class SubscriptionLink extends WebSocketLink {
  public getAuthState: () => AuthState;
  public onAuthError?: (error?: {}) => void;
  public onIdTokenExpired?: () => Promise<any>;

  private expired: boolean;

  constructor({ uri, getAuthState, onIdTokenExpired, onAuthError }: SubscriptionLinkParameters) {
    super({
      uri,
      options: {
        connectionParams: () => this.getConnectionsParams(),
        connectionCallback: (payload?: any) => this.connectionCallback(payload),
        reconnect: true,
        reconnectionAttempts: 5,
        lazy: true,
      },
      // tslint:disable-next-line
      webSocketImpl: class WebSocketWithoutProtocol extends WebSocket {
        constructor(url: string) {
          super(url); // ignore protocol
        }
      },
    });

    this.expired = false;
    this.getAuthState = getAuthState;
    this.onAuthError = onAuthError;
    this.onIdTokenExpired = onIdTokenExpired;
  }

  public handleTokenExpired() {
    if (typeof this.onIdTokenExpired === 'function') {
      return this.onIdTokenExpired();
    }

    return Promise.reject();
  }

  public handleAuthFailed(err?: object) {
    if (typeof this.onAuthError === 'function') {
      this.onAuthError(err);
    }
  }

  private async getConnectionsParams() {
    if (this.expired) {
      await this.handleTokenExpired();

      this.expired = false;
    }

    const authState = this.getAuthState();

    return authState;
  }

  private connectionCallback(payload?: any) {
    if (isIdTokenExpiredError(payload)) {
      this.expired = true;
    } else if (isRefreshTokenExpiredError(payload)) {
      this.handleAuthFailed();
    }
  }
}
