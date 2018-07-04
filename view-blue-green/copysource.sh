#!/bin/bash

if [ "$#" -ne 1 ]; then
    echo "Usage: copysource <bucket-name>"
    exit 1
fi

aws s3 cp router.zip s3://$1
aws s3 cp blue.yml s3://$1
aws s3 cp green.yml s3://$1
aws s3 cp viewbg.yml s3://$1
