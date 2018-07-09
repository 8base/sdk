#!/bin/bash

package=$1
title=$2
cmd=$3

status=0

echo -e "\033[0;33mStarting \"${title}\" for \"${package}\"\033[0m\n"

cd ./packages/$package

eval "${cmd}; if [ \"\$?\" != \"0\" ]; then status=1; fi"

sleep 2

if [ "$status" != "0" ]; then
  echo -e "\n\033[0;31mThe \"${title}\" for \"${package}\" exited with $status\033[0m\n"
else
  echo -e "\n\033[0;32mThe \"${title}\" for \"${package}\" exited with 0\033[0m\n"
fi

exit $status