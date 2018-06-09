#!/bin/sh
aws cloudformation create-stack \
--stack-name $1 \
--template-body file://master.yml \
--parameters ParameterKey=DeployBucketURL,ParameterValue=https://s3.amazonaws.com/$2 \
ParameterKey=CodeBucketName,ParameterValue=$2 \
--capabilities CAPABILITY_IAM
