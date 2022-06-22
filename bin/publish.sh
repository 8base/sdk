#!/bin/bash
beta=$1
status=0

(./bin/try-publish.sh "core" "api-client" "$beta") || status=1
(./bin/try-publish.sh "core" "apollo-client" "$beta") || status=1
(./bin/try-publish.sh "core" "apollo-links" "$beta") || status=1
(./bin/try-publish.sh "core" "auth" "$beta") || status=1
(./bin/try-publish.sh "core" "utils" "$beta") || status=1
(./bin/try-publish.sh "core" "validate" "$beta") || status=1
(./bin/try-publish.sh "core" "api-token-auth-client" "$beta") || status=1
(./bin/try-publish.sh "core" "web-auth0-auth-client" "$beta") || status=1
(./bin/try-publish.sh "core" "web-native-auth-client" "$beta") || status=1
(./bin/try-publish.sh "core" "web-cognito-auth-client" "$beta") || status=1
(./bin/try-publish.sh "core" "web-oauth-client" "$beta") || status=1
(./bin/try-publish.sh "core" "8base-sdk" "$beta") || status=1

(./bin/try-publish.sh "react" "app-provider" "$beta") || status=1
(./bin/try-publish.sh "react" "auth" "$beta") || status=1
(./bin/try-publish.sh "react" "crud" "$beta") || status=1
(./bin/try-publish.sh "react" "file-input" "$beta") || status=1
(./bin/try-publish.sh "react" "forms" "$beta") || status=1
(./bin/try-publish.sh "react" "permissions-provider" "$beta") || status=1
(./bin/try-publish.sh "react" "table-schema-provider" "$beta") || status=1
(./bin/try-publish.sh "react" "utils" "$beta") || status=1
(./bin/try-publish.sh "react" "8base-react-sdk" "$beta") || status=1

exit $status
