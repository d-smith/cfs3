# view-blue-green

## source code

To create the source code stack:

```console

./createstack-source.sh contentsource code97068

```

Use ../scripts/liststacks.sh to determine when the stack has successfully been created.

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

./createstack-test.sh contenttest test97068

```

Use ../scripts/liststacks.sh to determine when the stack has successfully been created.

Now the TEST distro is ready for test content. In this case, that is only one file - green.html.

```console

aws s3 cp green.html s3://test97068/green/foo.html

```

Use ../scripts/listdistributions.sh to get the distro URL. Make sure you can see /green/foo.html from the browser.

## active distro

Deploy the active distro stack. The active distro defaults to blue when created:

```console

./createstack-distro.sh contentdistro code97068

```

Use ../scripts/liststacks.sh to determine when the stack has successfully been created.

Now the active distro is ready for initial active content. In this case, that is only one file - blue.html. Get the bucket name from the contentdistro stack output.

```console

aws s3 cp blue.html s3://<contentdistro output bucket name>/blue/foo.html

```

Use ../scripts/listdistributions.sh to get the distro URL. Make sure you can see /foo.html from the browser. The Lambda edge function prepends the "active" folder to the URI. In this case, /blue.

## push TEST content

After TEST content is validated in the TEST distro, push TEST content to the correct folder (blue or green) in the active distro. First, see which folder is currently "active" in the active distro:

```console

./listactive.sh code97068

```

Push TEST content to the "inactive" folder in the active distro. For example, if the "active" folder is blue, push TEST content to green.

```console

aws s3 cp s3://test97068/green/foo.html s3://<contentdistro output bucket name>/green/foo.html

```

## validate content copy

There are a few ways to validate a copy, but the most straightforward is list both folders and compare file names and sizes.

```console

./listcontent.sh test97068/green > test.out
./listcontent.sh <contentdistro output bucket name>/green > stage.out
diff test.out stage.out

```

There should be no differences between test.out and stage.out. A common reason for differences is one or more remnants in the stage area from previous releases. That can be resolved with a controlled clean of the stage folder not included in this exercise.

If a more detailed validation is required related to object content, this should run within the region containing the buckets. AWS does not charge for incoming data and data transferred within a region.

## switch TEST content to active content

Update the routing function at the edge, using the output from the appropriate routing stack. This example switches to green:

```console

rm test.out stage.out
./updatestack.sh contentdistro-CloudFrontDistro-10EMHWDXQLQU5 arn:aws:lambda:us-east-1:<account-no>:function:contentdistro-GreenRouter-3QRHBV4OHAL8-EdgeProto-ERDAFC9P5S2L:1

```

Use ../scripts/liststacks.sh to determine when the stack has successfully been updated.

```console

./copygreenactive.sh code97068
./listactive.sh code97068

```

The "active" folder in the active distro has been switched to green. Use ../scripts/listdistributions.sh to get the distro URL. Make sure you can see /foo.html from the browser. The Lambda edge function prepends the "active" folder to the URI. In this case, now it is /green.
