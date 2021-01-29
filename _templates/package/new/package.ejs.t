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
    "moduleFileExtensions": [
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
