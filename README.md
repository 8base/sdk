# 8base SDK

[**Sign Up for 8Base**](https://app.8base.com)  🤘  [**Documentation Home**](https://docs.8base.com)  📑  [**Getting Started**](https://docs.8base.com/docs/getting-started/quick-start)  🚀  [**8base Plans**](https://www.8base.com/pricing)

8base provides a set of client libraries that are helpful when building frontend applications using 8base as a backend.

## Installation

The easiest way to install 8base-sdk is to use NPM and install the package locally in your project, adding it to the `package.json` file:

```shell
$ npm install --save 8base-sdk
```

or, if you are using Yarn:

```shell
$ yarn add 8base-sdk
```

## Getting Started

The 8base SDK is a collection of many different 8base module, like `@8base/auth`. Any of these packages can be installed independently if needed. Once the SDK is installed in a projects `node_modules` folder, it can be imported to necessary scripts.

```javascript
/* Importing full SDK */
import eightBase from '8base-sdk';
// ...or
var eightBbase = require('8base-sdk');

/* Importing specific module */
import { Auth } from '8base-sdk';
// ...or
var Auth = require('8base-sdk').Auth;
```

## SDK Modules

There are a number of SDK modules that can be imported and used in your scripts. Here we will continue to update a list of the core modules with brief descriptions, accompanied by links to repos with documentations.

### Core Packages

* [**8base-sdk**](./packages/core/8base-sdk) - This package consist of all @8base core packages.
* [**Auth**](./packages/core/auth) - For adding authentication to client-apps.
* [**Client**](./packages/core/api-client) - For communicating with the workspace API.
* [**Apollo Client**](./packages/core/apollo-client) - The Apollo Client library contains an extended implementation of [ApolloClient](https://github.com/apollographql/apollo-client) that includes several links to work with 8base services.
* [**Apollo Links**](./packages/core/apollo-links) - A collection of Apollo links for more efficient communication with the 8base API.
* [**Utils**](./packages/core/utils) - This library contains utils used by the other 8base service packages.
* [**Validate**](./packages/core/validate) - This library is used by the other 8base service packages to validate forms.

### React Packages

* [**8base-react-sdk**](./packages/react/8base-react-sdk) - This package consist of all @8base-react packages.
* [**App Provider**](./packages/react/app-provider) - Universal 8base App Provider loads fragments schema and provides it to Apollo client, along with authentication and table schema.
* [**Auth**](./packages/react/auth) - The 8base React Auth package contains a provider with authentication state and auth helpers.
* [**CRUD**](./packages/react/crud) - 8base CRUD is a wrapper under the apollo component to simplify working with the crud operations.
* [**File Input**](./packages/react/file-input) - File input integrated with Filestack and 8base.
* [**Forms**](./packages/react/forms) - 8base Forms is a thin React wrapper for React Final Forms to easy implement forms for 8base API entities.
* [**Permissions Provider**](./packages/react/permissions-provider) - Provider for 8base user permissions.
* [**Table Schema Provider**](./packages/react/permissions-provider) - The Table Schema Provider fetches 8base table schemas and provides it via React Context.

## Contributing

Like most great things, the 8base SDK is a work in progress. As a consequence of that, the SDK is constantly improving. Our SDK is public and open-sourced right here on GitHub. So whenever you want to, you could:

1. Reporting an Issue: 8base uses GitHub Issue Tracking to track issues (primarily bugs and contributions of new code). If you've found a bug, this is the place to start.

2. Fix an Issue: If you've not only found a problem in the SDK but also worked out the solution, please submit a pull request!

3. Add Features: You can help improve the 8base SDK by adding awesome features. It's honestly an open-book. If you think something is useful, others probably will too.

We'll do our best to review, respond, and merge all contributions in a timely manner!
