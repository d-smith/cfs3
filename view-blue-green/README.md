Deploy the stack:

<pre>
make

aws cloudformation create-stack \
--stack-name contentdistro \
--template-body file://master.yml \
--parameters ParameterKey=DeployBucketURL,ParameterValue=https://s3.amazonaws.com/code97068 \
ParameterKey=CodeBucketName,ParameterValue=code97068 \
--capabilities CAPABILITY_IAM
</pre>


Update the routing function at the edge, using the output from the appropriate routing stack.

<pre>
aws cloudformation update-stack \
--stack-name contentdistro-CloudFrontDistro-10EMHWDXQLQU5  \
--use-previous-template \
--parameters ParameterKey=LambdaVersionArn,ParameterValue=arn:aws:lambda:us-east-1:acount-no:function:contentdistro-GreenRouter-3QRHBV4OHAL8-EdgeProto-ERDAFC9P5S2L:1
</pre>