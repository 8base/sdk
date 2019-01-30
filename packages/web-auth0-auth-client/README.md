# 8base web auth0 auth client

The 8base auth0 auth client for the `AuthProvider`.

## WebAuth0AuthClient

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

-   [WebAuth0AuthClient](#webauth0authclient)
    -   [Parameters](#parameters)

### WebAuth0AuthClient

Create instacne of the web auth0 auth client.

#### Parameters

-   `workspaceId` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Identifier of the 8base app workspace.
-   `domain` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Domain. See auth0 documentation.
-   `clientId` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Client id. See auth0 documentation.
-   `redirectUri` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Redurect uri. See auth0 documentation.

## Usage

```js
import { AuthContext, AuthProvider, type AuthContextProps } from '@8base/auth';
import { WebAuth0AuthClient } form '@8base/web-auth0-auth-client';

  const authClient = new WebAuth0AuthClient({
    domain: 'domain',
    clientId: 'client-id',
    redirectUri: `${window.location.origin}/auth/callback`,
    logoutRedirectUri: `${window.location.origin}/auth`,
    workspaceId: 'workspace-id',
  });

  ...

  <AuthProvider authClient={ authClient }>
    ...
      <AuthContext.Consumer>
        {
          (auth: AuthContextProps) => (<div />)
        }
      </AuthContext.Consumer>
    ...  
  </AuthProvider>
```