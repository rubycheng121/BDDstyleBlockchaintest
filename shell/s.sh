#!/bin/sh
node_modules/cucumber/bin/cucumber.js temp/$1/s/test.feature > temp/$1/s/r.txt 2> temp/$1/s/r.err
exit 0
