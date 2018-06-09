# view-blue-green

## source code

To create the source code stack:

```console

aws cloudformation create-stack \
--stack-name contentsource \
--template-body file://source.yml \
--parameters ParameterKey=BucketName,ParameterValue=code97068

```

Source code bucket is now ready for artifacts. This is used when creating the distro stack. It is also used to track the active folder in the distro:

```console

make
./copysource.sh code97068
./copyblueactive.sh code97068
./listactive.sh code97068

```

## inactive TEST distro

This is used to test content for the next release.

To create the TEST distro stack:

```console

aws cloudformation create-stack \
--stack-name contenttest \
--template-body file://test.yml \
--parameters ParameterKey=BucketName,ParameterValue=test97068

```

## active distro

Deploy the distro stack. The distro defaults to blue when created:

```console

aws cloudformation create-stack \
--stack-name contentdistro \
--template-body file://master.yml \
--parameters ParameterKey=DeployBucketURL,ParameterValue=https://s3.amazonaws.com/code97068 \
ParameterKey=CodeBucketName,ParameterValue=code97068 \
--capabilities CAPABILITY_IAM

```

Update the routing function at the edge, using the output from the appropriate routing stack. This example switches to green:

```console

aws cloudformation update-stack \
--stack-name contentdistro-CloudFrontDistro-10EMHWDXQLQU5  \
--use-previous-template \
--parameters ParameterKey=LambdaVersionArn,ParameterValue=arn:aws:lambda:us-east-1:account-no:function:contentdistro-GreenRouter-3QRHBV4OHAL8-EdgeProto-ERDAFC9P5S2L:1

```