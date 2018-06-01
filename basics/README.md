# basic example

To create the stack:

<pre>
aws cloudformation create-stack \
--stack-name cf1 \
--template-body file://basic.yml \
--parameters ParameterKey=BucketName,ParameterValue=foo97068
</pre>