# 8base SDK - Client Module
The 8base SDK provides a convient way of initializing an API client to start making GraphQL calls to a workspace. 

This client library is used by the other 8base service packages to make requests to the 8base API. You can also use it independently to make custom requests to the API.

## Usage
The `Client` module exposes a number of different methods that can be used to configure itself. Those functions are listed below with relevant descriptions.

In the most basic case, the client can be used to query public resources from a given workspace.

```javascript
/* Import client module */
import { Client } from '@8base/api-client';

/* Instantiate new instance with workspace endpoint */
const client = new Client('https://api.8base.com/cjz1n2qrk00f901jt2utcc3m0');

/* Run a query with a callback handler */
client.request(`
  query {
    __schema {
      types {
        name
      }
    }
  }
`).then(console.log);
```

Should an `idToken` or `apiToken` need to get set, the `client.setIdToken(tk)` method can be used. Under the hood, this will set the supplied value as a Bearer token header on subsequent requests.

```javascript
/* Set the Token */
client.setIdToken('MY_API_TOKEN')

/* Run a query with a callback handler */
client.request(`
  query {
    privateResourceList {
      items {
        id
      }
    }
  }
`).then(console.log);
```

## Client Methods

#### setIdToken(token: String!)
Update the id token.

#### setRefreshToken(token: String!)
Update the refresh token.

#### setEmail(email: String!)
Update the user email.

#### setWorkspaceId(id: String!)
Update the workspace identifier.

#### request(query: GraphqlString!, variables: Object)
Send request to the API with variables that will be used when executing the query.
. Returns promise to be resolved.

```javascript
/* Set variables */
const variables = {
    search: "ste"
}

/* Set query */
const query = /* GraphQL */`
  query($search: String!) {
    resourceList(filter: {
        name: {
            contains: $search
        }
    }) {
      items {
        id
      }
    }
  }
`

/* Run a query with a callback handler */
client.request(query, variables).then(console.log);
```

## Alternatives
There any a number of ways developers can connect to their workspace and begin executing queries. The `Client` module is only one of them! If you're curious about alternatives for how you can create a client, check out the following video. However, remember that all GraphQL calls are only HTTP post requests – and connecting to your 8base workspace is no different!

[![Connecting to the API](https://miro.medium.com/max/4200/1*T13c_GK0ED6DluR7Wgrrxw.png)](https://www.youtube.com/watch?v=gLM-Fc6gWlE)