#!/bin/sh
cd temp/$1/m
mocha -c > mr.txt 2> mr.err
exit 0
