#!/bin/bash

status=0

(./bin/core/run.sh "api-client" "test" "yarn test --verbose") || status=1
(./bin/core/run.sh "apollo-links" "test" "yarn test --verbose") || status=1
(./bin/core/run.sh "apollo-client" "test" "yarn test --verbose") || status=1
(./bin/core/run.sh "utils" "test" "yarn test --verbose") || status=1
(./bin/core/run.sh "validate" "test" "yarn test --verbose") || status=1
(./bin/core/run.sh "auth" "test" "yarn test --verbose") || status=1
(./bin/core/run.sh "web-oauth-client" "test" "yarn test --verbose") || status=1
(./bin/core/run.sh "web-auth0-auth-client" "test" "yarn test --verbose") || status=1
(./bin/core/run.sh "api-token-auth-client" "test" "yarn test --verbose") || status=1
(./bin/core/run.sh "8base-sdk" "test" "yarn test --verbose") || status=1

(./bin/react/run.sh "app-provider" "test" "yarn test --verbose") || status=1
(./bin/react/run.sh "file-input" "test" "yarn test --verbose") || status=1
(./bin/react/run.sh "table-schema-provider" "test" "yarn test --verbose") || status=1
(./bin/react/run.sh "forms" "test" "yarn test --verbose") || status=1
(./bin/react/run.sh "permissions-provider" "test" "yarn test --verbose") || status=1
(./bin/react/run.sh "auth" "test" "yarn test --verbose") || status=1
(./bin/react/run.sh "8base-react-sdk" "test" "yarn test --verbose") || status=1

exit $status
