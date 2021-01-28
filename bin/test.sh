#!/bin/bash

status=0

(./bin/run.sh "core" "api-client" "test" "yarn test --verbose") || status=1
(./bin/run.sh "core" "apollo-links" "test" "yarn test --verbose") || status=1
(./bin/run.sh "core" "apollo-client" "test" "yarn test --verbose") || status=1
(./bin/run.sh "core" "utils" "test" "yarn test --verbose") || status=1
(./bin/run.sh "core" "validate" "test" "yarn test --verbose") || status=1
(./bin/run.sh "core" "auth" "test" "yarn test --verbose") || status=1
(./bin/run.sh "core" "web-oauth-client" "test" "yarn test --verbose") || status=1
(./bin/run.sh "core" "web-auth0-auth-client" "test" "yarn test --verbose") || status=1
(./bin/run.sh "core" "api-token-auth-client" "test" "yarn test --verbose") || status=1
(./bin/run.sh "core" "8base-sdk" "test" "yarn test --verbose") || status=1

(./bin/run.sh "react" "app-provider" "test" "yarn test --verbose") || status=1
(./bin/run.sh "react" "file-input" "test" "yarn test --verbose") || status=1
(./bin/run.sh "react" "table-schema-provider" "test" "yarn test --verbose") || status=1
(./bin/run.sh "react" "forms" "test" "yarn test --verbose") || status=1
(./bin/run.sh "react" "permissions-provider" "test" "yarn test --verbose") || status=1
(./bin/run.sh "react" "auth" "test" "yarn test --verbose") || status=1
(./bin/run.sh "react" "8base-react-sdk" "test" "yarn test --verbose") || status=1

exit $status
