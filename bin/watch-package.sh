#!/bin/bash

yarn babel src --ignore 'src/__fixtures__,**/__tests__' --env-name cjs --out-dir dist/ --watch
