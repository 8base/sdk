#!/bin/bash

status=0

(./bin/try-publish.sh "core" "api-client") || status=1
(./bin/try-publish.sh "core" "apollo-client") || status=1
(./bin/try-publish.sh "core" "apollo-links") || status=1
(./bin/try-publish.sh "core" "auth") || status=1
(./bin/try-publish.sh "core" "utils") || status=1
(./bin/try-publish.sh "core" "validate") || status=1
(./bin/try-publish.sh "core" "api-token-auth-client") || status=1
(./bin/try-publish.sh "core" "web-auth0-auth-client") || status=1
(./bin/try-publish.sh "core" "web-cognito-auth-client") || status=1
(./bin/try-publish.sh "core" "web-oauth-client") || status=1
(./bin/try-publish.sh "core" "8base-sdk") || status=1

(./bin/try-publish.sh "react" "app-provider") || status=1
(./bin/try-publish.sh "react" "auth") || status=1
(./bin/try-publish.sh "react" "crud") || status=1
(./bin/try-publish.sh "react" "file-input") || status=1
(./bin/try-publish.sh "react" "forms") || status=1
(./bin/try-publish.sh "react" "permissions-provider") || status=1
(./bin/try-publish.sh "react" "table-schema-provider") || status=1
(./bin/try-publish.sh "react" "utils") || status=1
(./bin/try-publish.sh "react" "8base-react-sdk") || status=1

exit $status
