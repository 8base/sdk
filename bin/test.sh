#!/bin/bash

status=0

(./bin/run.sh "api-client" "test" "yarn test --verbose") || status=1
(./bin/run.sh "apollo-links" "test" "yarn test --verbose") || status=1
(./bin/run.sh "apollo-provider" "test" "yarn test --verbose") || status=1
(./bin/run.sh "create-apollo-client" "test" "yarn test --verbose") || status=1
(./bin/run.sh "forms" "test" "yarn test --verbose") || status=1
(./bin/run.sh "utils" "test" "yarn test --verbose") || status=1
(./bin/run.sh "validate" "test" "yarn test --verbose") || status=1
(./bin/run.sh "auth-context" "test" "yarn test --verbose") || status=1

exit $status