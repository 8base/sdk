#!/bin/bash

lerna exec -- yarn unlink > /dev/null && ls packages | xargs -I {} echo yarn unlink @8base/{}

