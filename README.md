<img src="https://avatars1.githubusercontent.com/u/28789399?s=200&v=4" width="150px" >

---

The [8base][website-url] SDK is a collection of packages that make it easier to implement the various features of the 8base platform using JavaScript.

This repository is a monorepo including numerous developer tools. Each public sub-package is independently published to npm.

If you're developing on 8base now or are interested in using the 8base tools in the future, please join our [developer mailing list][dev-mailing-list-url] for updates.

[website-url]: https://8base.com
[whitepaper-url]: https://0xproject.com/pdfs/0x_white_paper.pdf
[dev-mailing-list-url]: https://app.8base.com/auth/signup

[![8base docs](https://img.shields.io/badge/docs-read-blue.svg)](https://docs.8base.com/docs)
[![8base slack](https://img.shields.io/badge/slack-join-orange.svg)](https://slack.8base.com/)

## Packages

| Package                                                        | Version                                                                                                             | Description                                                                                       |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| [`api-client`](/packages/api-client) | [![npm](https://img.shields.io/badge/npm-v0.15.1-blue.svg)](https://pypi.org/project/0x-contract-addresses/) | Client library used by the other 8base service packages to make requests to the 8base API.     |
| [`api-token-auth-client`](/packages/api-token-auth-client) |        |
| [`apollo-client`](/packages/apollo-client)             | [![PyPI](https://img.shields.io/badge/npm-v0.15.1-blue.svg)](https://pypi.org/project/0x-json-schemas/)             | The Apollo Client library contains an extended implementation of ApolloClient that includes several links to work with 8base services.                                                                           |
| [`apollo-links`](/packages/apollo-links)               | [![PyPI](https://img.shields.io/badge/npm-v0.15.1-blue.svg)](https://pypi.org/project/0x-order-utils/)               | A collection of Apollo links for more efficient communication with the 8base API.                      |
| [`app-provider`](/packages/app-provider)                 | [![PyPI](https://img.shields.io/badge/npm-v0.15.1-blue.svg)](https://pypi.org/project/0x-sra-client/)                 | Universal 8base App Provider loads fragments schema and provides it to Apollo client, along with authentication and table schema. |
| [`auth`](/packages/auth)                 | [![PyPI](https://img.shields.io/badge/npm-v0.15.1-blue.svg)](https://pypi.org/project/0x-sra-client/)                 | The 8base Auth package contains a provider with authentication state and auth helpers. |
| [`crud`](/packages/crud)                 | [![PyPI](https://img.shields.io/badge/npm-v0.15.1-blue.svg)](https://pypi.org/project/0x-sra-client/)                 | 8base CRUD is a wrapper under the react-apollo component to simplify working with the crud operations. |
| [`file-input`](/packages/file-input)                 | [![PyPI](https://img.shields.io/badge/npm-v0.15.1-blue.svg)](https://pypi.org/project/0x-sra-client/)                 | File input integrated with Filestack and 8base |
| [`forms`](/packages/forms)                 | [![PyPI](https://img.shields.io/badge/npm-v0.15.1-blue.svg)](https://pypi.org/project/0x-sra-client/)                 | A thin React wrapper for React Final Forms to easy implement forms for 8base API entities. |
| [`generators`](/packages/generators)                 | [![PyPI](https://img.shields.io/badge/npm-v0.15.1-blue.svg)](https://pypi.org/project/0x-sra-client/)                 |  |
| [`permissions-provider`](/packages/permissions-provider)                 | [![PyPI](https://img.shields.io/badge/npm-v0.15.1-blue.svg)](https://pypi.org/project/0x-sra-client/)                 | The Table Schema Provider fetching list of 8base table schemas and provide it via React Context. |
| [`react-native-auth0-auth-client`](/packages/react-native-auth0-auth-client)                 | [![PyPI](https://img.shields.io/badge/npm-v0.15.1-blue.svg)](https://pypi.org/project/0x-sra-client/)                 | he 8base react-native auth0 auth client for the AuthProvider. |
| [`table-schema-provider`](/packages/table-schema-provider)                 | [![PyPI](https://img.shields.io/badge/npm-v0.15.1-blue.svg)](https://pypi.org/project/0x-sra-client/)                 | Fetches 8base table schemas and provides it via React Context. |
| [`utils`](/packages/utils)                 | [![PyPI](https://img.shields.io/badge/npm-v0.15.1-blue.svg)](https://pypi.org/project/0x-sra-client/)                 | Contains utils used by the other 8base service packages. |
| [`validate`](/packages/validate)                 | [![PyPI](https://img.shields.io/badge/npm-v0.15.1-blue.svg)](https://pypi.org/project/0x-sra-client/)                 | Used by the other 8base service packages to validate forms.  |
| [`web-auth0-auth-client`](/packages/web-auth0-auth-client)                 | [![npm](https://img.shields.io/badge/npm-v0.15.1-blue.svg)](https://pypi.org/project/0x-sra-client/)                 | The 8base auth0 auth client for the AuthProvider. |
                                                                  |

## Usage

Node version >= 6.12 is required.

Most of the packages require additional typings for external dependencies.
You can include those by prepending the `@0x/typescript-typings` package to your [`typeRoots`](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html) config.

```json
"typeRoots": ["node_modules/@0x/typescript-typings/types", "node_modules/@types"],
```

## Contributing

We strongly recommend that the community help us make improvements and determine the future direction of the protocol. To report bugs within this package, please create an issue in this repository.

#### Read our [contribution guidelines](./CONTRIBUTING.md).

### Install dependencies

Make sure you are using Yarn v1.9.4. To install using brew:

```bash
brew install yarn@1.9.4
```

Then install dependencies

```bash
yarn install
```

### Build

To build all packages:

```bash
yarn build
```

To build a specific package:

```bash
PKG=@0x/web3-wrapper yarn build
```

To build all contracts packages:

```bash
yarn build:contracts
```

### Watch

To re-build all packages on change:

```bash
yarn watch
```

To watch a specific package and all it's dependent packages:

```bash
PKG=[NPM_PACKAGE_NAME] yarn watch

e.g
PKG=@0x/web3-wrapper yarn watch
```

### Clean

Clean all packages:

```bash
yarn clean
```

Clean a specific package

```bash
PKG=0x.js yarn clean
```

### Rebuild

To re-build (clean & build) all packages:

```bash
yarn rebuild
```

To re-build (clean & build) a specific package & it's deps:

```bash
PKG=0x.js yarn rebuild
```

### Lint

Lint all packages:

```bash
yarn lint
```

Lint a specific package:

```bash
PKG=0x.js yarn lint
```

### Run Tests

Run all tests:

```bash
yarn test
```

Run a specific package's test:

```bash
PKG=@0x/web3-wrapper yarn test
```

Run all contracts packages tests:

```bash
yarn test:contracts
```


---

## Build
```
yarn build-packages
```

## Deploy
```
yarn bump
```
