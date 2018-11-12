#!/bin/bash

lerna exec -- yarn link > /dev/null && ls packages | xargs -I {} echo yarn link @8base/{}

