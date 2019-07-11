# `@8base/react-sdk`

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Examples](#examples)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation
```
npm install --save @8base/react-sdk
```
or
```
yarn add @8base/react-sdk
```

## Getting Started

`@8base/react-sdk` provides tools to use 8base with React.
```
import React from 'react';
import { AppProvider, WebAuth0AuthClient, gql } from '@8base/react-sdk';
import { Query } from 'react-apollo';

const URI = "8base API URI',

const AUTH_CLIENT_ID = 'auth0 client ID';
const AUTH_DOMAIN = 'auth0 client domain';

const auth0WebClient = new WebAuth0AuthClient({
  domain: AUTH_DOMAIN,
  clientId: AUTH_CLIENT_ID,
  redirectUri: `${window.location.origin}/auth/callback`,
  logoutRedirectUri: `${window.location.origin}/`
});

const SAMPLE_QUERY = gql`
  query UserQuery {
    user {
      id
      email
    }
  }
`;

function App() {
  return (
    <div className="App">
      <AppProvider
        uri={URI}
        authClient={auth0WebClient}
      >
        {({ loading }) => {
          if (loading) {
            return <p>Please wait...</p>;
          }
          return <Query query={ SAMPLE_QUERY }>...</Query>
        }}
      </AppProvider>
    </div>
  );
}
```

## Examples

- [Guest App](https://codesandbox.io/s/github/8base/sdk/tree/master/examples/guest-app)
- [With Api Token App](https://codesandbox.io/s/github/8base/sdk/tree/master/examples/with-api-token-app)
- [With Authorization App](https://codesandbox.io/s/github/8base/sdk/tree/master/examples/with-authorization-app)

