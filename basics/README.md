# basic example

To create the stack:

```console

aws cloudformation create-stack \
--stack-name cf1 \
--template-body file://basic.yml \
--parameters ParameterKey=BucketName,ParameterValue=foo97068

```

After created, copy basic.html into the orig bucket, and retreive it from the cloud formation base url + /basic.html