#!/bin/bash

status=0

(./bin/try-publish.sh "api-client") || status=1
(./bin/try-publish.sh "apollo-client") || status=1
(./bin/try-publish.sh "apollo-links") || status=1
(./bin/try-publish.sh "auth") || status=1
(./bin/try-publish.sh "utils") || status=1
(./bin/try-publish.sh "validate") || status=1
(./bin/try-publish.sh "api-token-auth-client") || status=1
(./bin/try-publish.sh "web-auth0-auth-client") || status=1
(./bin/try-publish.sh "web-cognito-auth-client") || status=1
(./bin/try-publish.sh "web-oauth-client") || status=1
(./bin/try-publish.sh "8base-sdk") || status=1

exit $status
