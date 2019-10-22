# 8base SDK - Auth Module
8base SDK provides an easy way to implement authentication in your client application. Whether you're using 8base Authentication, Auth0, or an OpenID provider, the `Auth` module helps in managing the authentication flow.

For further information regarding Auth, please [refer to the docs](https://docs.8base.com/development-tools/sdk/auth).

## Usage
The `Auth` module exposes several differnt auth strategies. These can be declared as strings or imported from the SDK as `AUTH_STRATEGIES`. The `Auth.createClient` function accepts two condiuration objects, from which it generates the an `authClient` that is instatiated per the given strategy.

Some required values include the following:

* `domain`
* `clientId`
* `logoutUrl`
* `redirectUri`

All these values can be collected from an [Authentication Profile](https://docs.8base.com/8base-console/authentication#authorization) created in the 8base management console. 

## Auth Strategies
There are currently several different available auth strategies that the SDK supports. They are:

```javascript
AUTH_STRATEGIES {
  WEB_8BASE = 'web_8base',
  WEB_AUTH0 = 'web_auth0',
  API_TOKEN = 'api_token'
}
```

##### `WEB_8BASE` and `WEB_AUTH0` Example
To initialize a new `authClient` using the `WEB_8BASE` or `WEB_AUTH0` strategy, refer to the following configuration.

```javascript
import { Auth, AUTH_STRATEGIES } from "@8base/auth";
/**
 * Creating an Authentication Profile in 8base will provide 
 * you with a Client ID and Domain.
 */
const domain = 'authentication-profile.auth.domain';
const clientId = 'authentication-profile-client-id';
/**
 * The redirect and logout URIs are all configured in the 
 * authentication profile that gets set up in the 8base
 * management console.
 */
const logoutRedirectUri = `${window.location.origin}/logout`;
const redirectUri = `${window.location.origin}/auth/callback`;
/**
 * There are multiple auth strategies that can be 
 * used when using 8base. By default, specifying
 * 'web_8base' will configure the 8base auth client.
 */
const authClient = Auth.createClient(
  {
    strategy: AUTH_STRATEGIES['STRATEGY_NAME']
  },
  {
    domain,
    clientId,
    redirectUri,
    logoutRedirectUri
  }
);
```

##### `API_TOKEN` Example
To initialize a new `authClient` using the `API_TOKEN` strategy, refer to the following configuration.

```javascript
import { Auth } from "@8base/auth";
/**
 * Set the API token generated in 8base management console.
 */
const apiToken = "8base-api-token";
/**
 * Specify the strategy and API token.
 */
export default Auth.createClient(
  {
    strategy: "api_token"
  },
  {
    apiToken
  }
);
```

## Documentation
An important part of using the SDK's Auth module is properly configuring an Authentication Profile in the management console. Please refer to the [Authentication Profile documentation](https://docs.8base.com/8base-console/authentication#authorization) to understand the required steps.

Custom authentication flows are 100% possible in 8base using the `userLogin` and `signUpUserWithPassword` mutations. However, the current strategies are excellent at getting users up and running quickly with authentication and we are continuing to improve the auth strategies currently available.