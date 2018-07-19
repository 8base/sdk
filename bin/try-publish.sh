#!/bin/bash

package=$1

status=0

echo -e "\033[0;33mStarting try to publish for \"${package}\"\033[0m\n"

cd ./packages/$package

name=$(cat package.json | grep name | head -n 1 | cut -d'"' -f 4)
version=$(cat package.json | grep version | head -n 1 | cut -d'"' -f 4)
published=$(npm info $name version 2> /dev/null)

if [ -z "$published" ]; then
  published="0.0.0"
fi

if [ "$published" != "$version" ]; then
  echo "Try to publish $version version of the $name package."
  echo "//registry.npmjs.org/:_authToken=\${NPM_TOKEN}" > .npmrc
  npm publish --access public; if [ "$?" != "0" ]; then status=1; fi
else 
  echo "Current version of the package already published to the NPM."
fi

sleep 2

if [ "$status" != "0" ]; then
  echo -e "\n\033[0;31mThe try to publish for \"${package}\" exited with $status\033[0m\n"
else
  echo -e "\n\033[0;32mThe try to publish for \"${package}\" exited with 0\033[0m\n"
fi

exit $status