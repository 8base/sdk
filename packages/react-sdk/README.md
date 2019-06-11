# `@8base/react-sdk`

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
          return <Query query={ SAMPLE_QUERY }>...</Query
        }}
      </AppProvider>
    </div>
  );
}
```

