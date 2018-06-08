#!/bin/sh
aws cloudformation create-stack \
--stack-name $1 \
--template-body file://basic.yml \
--parameters ParameterKey=BucketName,ParameterValue=$2
