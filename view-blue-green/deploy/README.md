# deploy pipeline

This folder contains an example code deploy pipeline that can be used with the view blue green cloud front distribution stack.

The pipeline is used to unzip one or more application zip files into an inactive s3 bucket folder/partition, with the pipeline initiated when a zip file is dropped into its directory.

To use, first install the master view blue green stack. Once that is in place, instantiate the pipeline stack twice - once for the blue partition, once for the green. You can then stage files by dropping the zip in bucket associated with the inactive partition.

To install the pipeline, you need to know the CloudFront distribution id and bucket name from the view blue green stack. For the blue pipeline, you need to know the full lambda version of the blue router lambda edge function. For the green pipeline, you need to know the full lambda version of the green router lambda edge function.

Look at `stage.sh` to see how to incorporate the buildspec.yml file into the distribution to enable the code build job.

To deploy the sample app, first create the distribution using `stage.sh`, which will do an `ng build` to create the dist files, copied the buildspec.yml into dist, the zips up the contents of dist.

Once the zip is in place, drop it in the bucket associated with the inactive partition. Remember you can use the `active` query to determine if the partition is active or not. 

Here's an example of how to use the pipeline to stage an application.

```console
$ ./stage.sh 
up to date in 6.491s
                                                                              u Date: 2018-07-16T18:07:25.768Z
Hash: 46a8cece449370535ca5
Time: 9964ms
chunk {main} main.js, main.js.map (main) 9.52 kB [initial] [rendered]
chunk {polyfills} polyfills.js, polyfills.js.map (polyfills) 227 kB [initial] [rendered]
chunk {runtime} runtime.js, runtime.js.map (runtime) 5.22 kB [entry] [rendered]
chunk {styles} styles.js, styles.js.map (styles) 15.6 kB [initial] [rendered]
chunk {vendor} vendor.js, vendor.js.map (vendor) 2.74 MB [initial] [rendered]
  adding: buildspec.yml (deflated 46%)
  adding: sample-app/ (stored 0%)
  adding: sample-app/favicon.ico (deflated 75%)
  adding: sample-app/polyfills.js.map (deflated 80%)
  adding: sample-app/index.html (deflated 56%)
  adding: sample-app/runtime.js (deflated 73%)
  adding: sample-app/main.js.map (deflated 53%)
  adding: sample-app/3rdpartylicenses.txt (deflated 78%)
  adding: sample-app/polyfills.js (deflated 81%)
  adding: sample-app/styles.js.map (deflated 71%)
  adding: sample-app/vendor.js (deflated 83%)
  adding: sample-app/main.js (deflated 71%)
  adding: sample-app/runtime.js.map (deflated 70%)
  adding: sample-app/styles.js (deflated 69%)
  adding: sample-app/vendor.js.map (deflated 83%)
$ curl https://dzm1u37x9ob7l.cloudfront.net?active
blue
$ aws s3 cp deploy.zip s3://green-deploy-myartifactbucket-1wuttqaxzbh98
upload: ./deploy.zip to s3://green-deploy-myartifactbucket-1wuttqaxzbh98/deploy.zip
```