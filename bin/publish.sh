#!/bin/bash

status=0

(./bin/try-publish.sh "api-client") || status=1
(./bin/try-publish.sh "apollo-client") || status=1
(./bin/try-publish.sh "apollo-links") || status=1
(./bin/try-publish.sh "app-provider") || status=1
(./bin/try-publish.sh "react-auth") || status=1
(./bin/try-publish.sh "crud") || status=1
(./bin/try-publish.sh "file-input") || status=1
(./bin/try-publish.sh "forms") || status=1
(./bin/try-publish.sh "permissions-provider") || status=1
(./bin/try-publish.sh "table-schema-provider") || status=1
(./bin/try-publish.sh "utils") || status=1
(./bin/try-publish.sh "validate") || status=1
(./bin/try-publish.sh "api-token-auth-client") || status=1
(./bin/try-publish.sh "web-auth0-auth-client") || status=1
(./bin/try-publish.sh "react-sdk") || status=1

exit $status
