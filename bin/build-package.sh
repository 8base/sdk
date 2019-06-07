#!/bin/bash

echo "$(tput setaf 3)"
echo "Starting \"build\" for \"${PWD##*/}\""
echo "$(tput setaf 7)"

rimraf dist
yarn tsc
