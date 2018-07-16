# deploy pipeline

This folder contains an example code deploy pipeline that can be used with the view blue green cloud front distribution stack.

The pipeline is used to unzip one or more application zip files into an inactive s3 bucket folder/partition, with the pipeline initiated when a zip file is dropped into its directory.

To use, first install the master view blue green stack. Once that is in place, instantiate the pipeline stack twice - once for the blue partition, once for the green. You can then stage files by dropping the zip in bucket associated with the inactive partition.

To install the pipeline, you need to know the CloudFront distribution id and bucket name from the view blue green stack. For the blue pipeline, you need to know the full lambda version of the blue router lambda edge function. For the green pipeline, you need to know the full lambda version of the green router lambda edge function.

Look at `stage.sh` to see how to incorporate the buildspec.yml file into the distribution to enable the code build job.