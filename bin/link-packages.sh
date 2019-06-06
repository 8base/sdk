#!/bin/bash

lerna exec -- yarn link > /dev/null && lerna list | xargs -I {} echo yarn link {}

