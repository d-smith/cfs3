#!/bin/sh
aws s3 rm s3://$1/active/*.txt
aws s3 cp blueactive.txt s3://$1/active/blueactive.txt