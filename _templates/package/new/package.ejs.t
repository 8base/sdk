---
to: packages/<%= name %>/package.json
---
{
  "name": "@8base/<%= name %>",
  "version": "<%= version %>",
  "repository": "https://github.com/8base/sdk",
  "main": "dist/index.js",
  "module": "dist/index.js",
  "scripts": {
    "build": "../../../bin/build-package.sh",
    "watch": "../../../bin/watch-package.sh",
    "test": "NPM_ENV=test jest"
  },
  "dependencies": {},
  "devDependencies": {
    "jest": "24.7.1",
    "jest-localstorage-mock": "^2.2.0",
    "ts-jest": "^24.0.2",
    "typescript": "^3.5.1"
  },
  "jest": {
    "globals": {
      "ts-jest": {
        "tsConfig": "<rootDir>/tsconfig.json"
      }
    },
    "setupFiles": [
      "jest-localstorage-mock"
    ],
    "collectCoverageFrom": [
      "<rootDir>/src/**",
      "!<rootDir>/**/__tests__/**"
    ],
    "moduleNameMapper": {
      "8base-sdk": "<rootDir>/../../core/8base-sdk/src/index.ts",
      "@8base/api-client": "<rootDir>/../../core/api-client/src/index.ts",
      "@8base/api-token-auth-client": "<rootDir>/../../core/api-token-auth-client/src/index.ts",
      "@8base/apollo-client": "<rootDir>/../../core/apollo-client/src/index.ts",
      "@8base/apollo-links": "<rootDir>/../../core/apollo-links/src/index.ts",
      "@8base/auth": "<rootDir>/../../core/auth/src/index.ts",
      "@8base/utils": "<rootDir>/../../core/utils/src/index.ts",
      "@8base/validate": "<rootDir>/../../core/validate/src/index.ts",
      "@8base/web-auth0-auth-client": "<rootDir>/../../core/web-auth0-auth-client/src/index.ts",
      "@8base/web-cognito-auth-client": "<rootDir>/../../core/web-cognito-auth-client/src/index.ts",
      "@8base/web-native-auth-client": "<rootDir>/../../core/web-native-auth-client/src/index.ts",
      "@8base/web-oauth-client": "<rootDir>/../../core/web-oauth-client/src/index.ts",
      "8base-react-sdk": "<rootDir>/../../react/8base-react-sdk/src/index.ts",
      "@8base-react/app-provider": "<rootDir>/../../react/app-provider/src/index.ts",
      "@8base-react/auth": "<rootDir>/../../react/auth/src/index.ts",
      "@8base-react/crud": "<rootDir>/../../react/crud/src/index.ts",
      "@8base-react/file-input": "<rootDir>/../../react/file-input/src/index.ts",
      "@8base-react/forms": "<rootDir>/../../react/forms/src/index.ts",
      "@8base-react/permissions-provider": "<rootDir>/../../react/permissions-provider/src/index.ts",
      "@8base-react/table-schema-provider": "<rootDir>/../../react/table-schema-provider/src/index.ts",
      "@8base-react/utils": "<rootDir>/../../react/utils/src/index.ts"
    },
    "moduleFileExtensions":  [
      "ts",
      "tsx",
      "js",
      "jsx"
    ],
    "transform": {
      "^.+\\.(ts|tsx)$": "ts-jest"
    },
    "testMatch": [
      "**/__tests__/**/*.[jt]s?(x)",
      "**/?(*.)+(spec|test).[jt]s?(x)"
    ]
  },
  "license": "MIT"
}
