#!/bin/sh
IFS=$'\n'
for line in `aws s3 ls --recursive s3://$1`
do
    SIZE=$(awk -F' ' '{print $3}' <<< $line)
    FILE=$(awk -F' ' '{print $4}' <<< $line)
    echo $SIZE $FILE
done
