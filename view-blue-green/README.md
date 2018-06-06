Deploy the lambdas:

<pre>
make

aws cloudformation create-stack \
--stack-name contentdistro \
--template-body file://master.yml \
--parameters ParameterKey=DeployBucketURL,ParameterValue=https://s3.amazonaws.com/code97068 \
ParameterKey=CodeBucketName,ParameterValue=code97068 \
--capabilities CAPABILITY_IAM

aws cloudformation create-stack \
--stack-name blue \
--template-body file://blue.yml \
--parameters ParameterKey=CodeBucketName,ParameterValue=code97068 \
--capabilities CAPABILITY_IAM
</pre>

Deploy the cloud front distro, and point to your initial routing, e.g. blue:

</pre>
aws cloudformation create-stack \
--stack-name viewbg1 \
--template-body file://viewbg.yml \
--parameters ParameterKey=LambdaVersionArn,ParameterValue=arn:aws:lambda:us-east-1:account-no:function:blue-EdgeProto-QEJO1LEIHXET:1
</pre>

Update the routing function at the edge:

<pre>
aws cloudformation update-stack \
--stack-name viewbg1 \
--use-previous-template \
--parameters ParameterKey=LambdaVersionArn,ParameterValue=arn:aws:lambda:us-east-1:account-no:function:green-EdgeProto-110EB0SN0PBWJ:1
</pre>