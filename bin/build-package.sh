#!/bin/bash

echo "$(tput setaf 3)"
echo "Starting \"build\" for \"${PWD##*/}\""
echo "$(tput setaf 7)"

rm -rf ./dist && mkdir ./dist
yarn babel src --ignore 'src/__fixtures__,**/__tests__' --env-name cjs --out-dir dist/
yarn babel src --ignore 'src/__fixtures__,**/__tests__' --env-name mjs --out-dir dist/module
for file in $(find dist/module -name '*.js'); 
  do mv "$file" `echo "$file" | sed 's/dist\\/module/dist/g' | sed 's/.js$/.mjs/g'`; 
done
rm -rf dist/module
yarn flow-copy-source src dist
