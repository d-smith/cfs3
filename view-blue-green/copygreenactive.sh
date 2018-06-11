#!/bin/sh
aws s3 rm --recursive --include "*.txt" s3://$1/active/
aws s3 cp greenactive.txt s3://$1/active/greenactive.txt
