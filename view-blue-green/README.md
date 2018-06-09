# view-blue-green

## source code

To create the source code stack:

```console

aws cloudformation create-stack \
--stack-name contentsource \
--template-body file://source.yml \
--parameters ParameterKey=BucketName,ParameterValue=code97068

```

Source code bucket is now ready for artifacts. This is used when creating the distro stack. It is also used to track the "active" folder in the active distro:

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

Now the TEST distro is ready for test content. In this case, that is only one file - green.html.

```console

aws s3 cp green.html s3://test97068/foo.html

```

## active distro

Deploy the active distro stack. The active distro defaults to blue when created:

```console

aws cloudformation create-stack \
--stack-name contentdistro \
--template-body file://master.yml \
--parameters ParameterKey=DeployBucketURL,ParameterValue=https://s3.amazonaws.com/code97068 \
ParameterKey=CodeBucketName,ParameterValue=code97068 \
--capabilities CAPABILITY_IAM

```

Now the active distro is ready for initial active content. In this case, that is only one file - blue.html. Get the bucket name from the contentdistro stack output.

```console

aws s3 cp blue.html s3://<contentdistro output bucket name>/blue/foo.html

```

## push TEST content

After TEST content is validated in the TEST distro, push TEST content to the correct folder (blue or green) in the active distro. First, see which folder is currently "active" in the active distro:

```console

./listactive.sh code97068

```

Push TEST content to the "inactive" folder in the active distro. For example, if the "active" folder is blue, push TEST content to green.

```console

aws s3 cp s3://test97068/foo.html s3://<contentdistro output bucket name>/green/foo.html

```

## validate content copy

There are a few ways to validate a copy, but the most straightforward is list both folders and compare file names and sizes.

## switch TEST content to active content

Update the routing function at the edge, using the output from the appropriate routing stack. This example switches to green:

```console

aws cloudformation update-stack \
--stack-name contentdistro-CloudFrontDistro-10EMHWDXQLQU5  \
--use-previous-template \
--parameters ParameterKey=LambdaVersionArn,ParameterValue=arn:aws:lambda:us-east-1:account-no:function:contentdistro-GreenRouter-3QRHBV4OHAL8-EdgeProto-ERDAFC9P5S2L:1

```