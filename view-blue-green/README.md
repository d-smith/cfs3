# view-blue-green

## source code

To create the source code stack:

```console

./createstack-source.sh contentsource code97068

```

Use ../scripts/liststacks.sh to determine when the stack has successfully been created.

Source code bucket is now ready for artifacts. This is used when creating the distro stack:

```console

make
./copysource.sh code97068

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

Use ../scripts/listdistributions.sh to get the distro URL or grab it from the stack output. Make sure you can see /foo.html from the browser. The Lambda edge function prepends the "active" folder to the URI. In this case, /blue.

## push TEST content

After TEST content is validated in the TEST distro, push TEST content to the correct folder (blue or green) in the active distro. First, see which folder is currently "active" in the active distro using the active query on the content distribution domain name, for example:

```console

$ curl https://d2w9s8k7qdityr.cloudfront.net?active
green

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

The "active" folder in the active distro has been switched to green. Use ../scripts/listdistributions.sh to get the distro URL. Make sure you can see /foo.html from the browser. The Lambda edge function prepends the "active" folder to the URI. In this case, now it is /green.

## Previewing Content, Viewing Inactive Content

Using HTTP headers, inactive content can be viewed as well.

* To view content using the full bucket path without the lambda function amending the uri, use `content-preview` set to anything.
* To instruct the lambda function to route the request to the inactive content, use `content-inactive` set to anything.

Example:

````console

$ curl https://d2iujgwsf3tt4j.cloudfront.net?active
blue
$ curl https://d2iujgwsf3tt4j.cloudfront.net/foo.html
<html>
<body>
<h3>blue</h3>
</body>
</html>
$ curl https://d2iujgwsf3tt4j.cloudfront.net/foo.html -H 'content-inactive:sure'
<html>
<body>
<h3>green</h3>
</body>
</html>
curl https://d2iujgwsf3tt4j.cloudfront.net/green/foo.html -H 'content-preview:sure'
<html>
<body>
<h3>green</h3>
</body>
</html>

````

## Retrieving Specific File Versions

When storing content in a versioned bucket, specific versions of a file may be retrieved using the s3 version id.

Example:

````console

$ curl https://d21k5bj70t6gzi.cloudfront.net/foo.html
<html>
<body>
<h3>blue</h3>
</body>
</html>
$ aws s3 cp bluenew.html s3://contentdistro6-cloudfrontdistro-1hj-contentbucket-yqrqi5zi5o51/blue/foo.html
$ ../scripts/invalidatedistributioncache.sh E2A0DA2OOSVHNP
{
    "Location": "https://cloudfront.amazonaws.com/2017-10-30/distribution/E2A0DA2OOSVHNP/invalidation/I1Z0NXPZWPXUY7",
    "Invalidation": {
        "Id": "I1Z0NXPZWPXUY7",
        "Status": "InProgress",
        "CreateTime": "2018-07-12T21:58:00.179Z",
        "InvalidationBatch": {
            "Paths": {
                "Quantity": 1,
                "Items": [
                    "/*"
                ]
            },
            "CallerReference": "cli-1531432679-248582"
        }
    }
}

$ curl https://d21k5bj70t6gzi.cloudfront.net/foo.html
<html>
<body>
<h3>newer and blue-er</h3>
</body>
</html>
$ aws s3api list-object-versions --bucket contentdistro6-cloudfrontdistro-1hj-contentbucket-yqrqi5zi5o51
{
    "Versions": [
        {
            "ETag": "\"99b5fcd68c59f6ec1d95d926bdf691dc\"",
            "Size": 57,
            "StorageClass": "STANDARD",
            "Key": "blue/foo.html",
            "VersionId": "4u0t4OpxKUXwQHaYLAarKeWIabA8ZgKh",
            "IsLatest": true,
            "LastModified": "2018-07-12T21:57:37.000Z",
            "Owner": {
                "DisplayName": "dougasmith",
                "ID": "99e53847ad47ffa0708aec43f34d7dbd9d0433f16cc4997e21e625badbc08b0d"
            }
        },
        {
            "ETag": "\"6ef58be03c35d02d5d2b25a09c7a2add\"",
            "Size": 44,
            "StorageClass": "STANDARD",
            "Key": "blue/foo.html",
            "VersionId": "e1RIQLY3U2rAa_ch5hAbAuSctWZCKave",
            "IsLatest": false,
            "LastModified": "2018-07-12T21:42:19.000Z",
            "Owner": {
                "DisplayName": "dougasmith",
                "ID": "99e53847ad47ffa0708aec43f34d7dbd9d0433f16cc4997e21e625badbc08b0d"
            }
        },
        {
            "ETag": "\"a6ff3aee589e18c57bdb5885889740da\"",
            "Size": 45,
            "StorageClass": "STANDARD",
            "Key": "green/foo.html",
            "VersionId": "MRRdCSWTaQTisaDNNobSqaswjr_eMXWG",
            "IsLatest": true,
            "LastModified": "2018-07-12T21:42:19.000Z",
            "Owner": {
                "DisplayName": "dougasmith",
                "ID": "99e53847ad47ffa0708aec43f34d7dbd9d0433f16cc4997e21e625badbc08b0d"
            }
        }
    ]
}
$ curl https://d21k5bj70t6gzi.cloudfront.net/foo.html?versionId=e1RIQLY3U2rAa_ch5hAbAuSctWZCKave
<html>
<body>
<h3>blue</h3>
</body>
</html>
$ curl https://d21k5bj70t6gzi.cloudfront.net/foo.html?versionId=4u0t4OpxKUXwQHaYLAarKeWIabA8ZgKh
<html>
<body>
<h3>newer and blue-er</h3>
</body>
</html>
