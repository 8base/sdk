export enum AUTH_STRATEGIES {
  /**
   * @deprecated - please use instead declarative variables like `WEB_8BASE_AUTH0` or `WEB_8BASE_COGNITO`
   */
  WEB_8BASE = 'web_8base',
  WEB_8BASE_AUTH0 = 'web_8base_auth0',
  WEB_8BASE_NATIVE = 'web_8base_native',
  WEB_8BASE_COGNITO = 'web_8base_cognito',
  WEB_AUTH0 = 'web_auth0',
  WEB_COGNITO = 'web_cognito',
  WEB_OAUTH = 'web_oauth',
  API_TOKEN = 'api_token',
}
