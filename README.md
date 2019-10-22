# 8base SDK

[**Sign Up for 8Base**](https://app.8base.com)	🤘	[**Documentation Home**](https://docs.8base.com)	📑	[**Getting Started**](https://docs.8base.com/getting-started/quick-start)	🚀	[**8base Plans**](https://www.8base.com/pricing)

8base provides a set of client libraries that are helpful when building frontend applications using 8base as a backend.

## Installation
The easiest way to install 8abse-sdk is to use NPM and install the package locally in your project, adding it to the `package.json` file:

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

* [**Auth**](./packages/auth/README.md) - For adding authentication to client-apps.
* [**Client**](./packages/api-client/README.md) - For communicating with the workspace API.

## Contributing
Like most great things, the 8base SDK is a work in progress. As a consequence of that, the SDK is constantly improving. Our SDK is public and open-sourced right here on GitHub. So whenever you want to, you could:

1. Reporting an Issue: 8base uses GitHub Issue Tracking to track issues (primarily bugs and contributions of new code). If you've found a bug, this is the place to start.

2. Fix an Issue: If you've not only found a problem in the SDK but also worked out the solution, please submit a pull request!

3. Add Features: You can help improve the 8base SDK by adding awesome features. It's honestly an open-book. If you think something is useful, others probably will too.

We'll do our best to review, respond, and merge all contributions in a timely manner!
