# 8base api token auth client

The 8base web oauth client for the `AuthProvider`.

## WebOAuthClient

#### Table of Contents

-   [WebOAuthClient](#webOAuthClient)
    -   [Parameters](#parameters)

### WebOAuthClient

Create instance of the web oauth client

#### Parameters

-   `authorize` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function)** Function used to describe authorize logic.

## Usage
### Firebase oauth
```js
import firebase from 'firebase';
import { WebOAuthClient } from '@8base/web-oauth-client';

const FIREBASE_CONFIGURATION = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

const firebaseAuth = firebase.initializeApp(FIREBASE_CONFIGURATION).auth();

const authClient = new WebOAuthClient({
  authorize (email, password) {
    return firebaseAuth.signInWithEmailAndPassword(
      email,
      password,
    )
      .then(() => firebaseAuth.currentUser.getIdToken())
      .then((token) => {
        return token;
      })
    },
  logout() {
    window.addEventListener('unload', () => {
      this.purgeState();
    });

    window.location.href = '/';
  }
});
```
## Examples

[Firebase oauth example](https://github.com/8base/8base-firebase-auth-example)  
[IBM cloud oauth example](https://github.com/8base/8base-ibm-app-id-example)
