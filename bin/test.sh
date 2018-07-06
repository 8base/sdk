#!/bin/bash

run_command()
{
  local package=$1
  local name=$2
  local cmd=$3
  local status=0

  echo -e "\033[0;33mStarting \"${name}\" for \"${package}\"\033[0m"

  eval "${cmd} if [ \"\$?\" != \"0\" ]; then status=1; fi"

  sleep 2

  if [ "$status" != "0" ]; then
    echo -e "\033[0;31mThe \"${name}\" for \"${package}\" exited with $status\033[0m\n"
  else
    echo -e "\033[0;32mThe \"${name}\" for \"${package}\" exited with 0\033[0m\n"
  fi

  return $status
}

status=0

(run_command "api-client" "test" "(cd ./packages/api-client && yarn test --verbose) ;") || status=1
(run_command "apollo-links" "test" "(cd ./packages/apollo-links && yarn test --verbose) ;") || status=1
(run_command "apollo-provider" "test" "(cd ./packages/apollo-provider && yarn test --verbose) ;") || status=1
(run_command "create-apollo-client" "test" "(cd ./packages/create-apollo-client && yarn test --verbose) ;") || status=1
(run_command "forms" "test" "(cd ./packages/forms && yarn test --verbose) ;") || status=1
(run_command "utils" "test" "(cd ./packages/utils && yarn test --verbose) ;") || status=1
(run_command "validate" "test" "(cd ./packages/validate && yarn test --verbose) ;") || status=1

exit $status


