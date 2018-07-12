#!/bin/sh
aws s3 rm --recursive --include "*.txt" s3://$1/active/
aws s3 cp blueactive.txt s3://$1/active/blueactive.txt
