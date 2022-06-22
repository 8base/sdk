#!/bin/bash

echo "$(tput setaf 3)"
echo "Starting \"build\" for \"${PWD##*/}\""
echo "$(tput setaf 7)"

rimraf dist
tsc --outDir ./dist/mjs
tsc --module commonjs --outDir ./dist/cjs
