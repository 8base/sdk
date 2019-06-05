#!/bin/bash

lerna exec -- yarn unlink > /dev/null && lerna list | xargs -I {} echo yarn unlink {}

