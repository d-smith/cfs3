#!/bin/sh
aws cloudformation update-stack \
--stack-name $1  \
--use-previous-template \
--parameters ParameterKey=LambdaVersionArn,ParameterValue=$2
