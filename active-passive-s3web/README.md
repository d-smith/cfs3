# active-passive-s3web

This example shows the use of two s3 web-enable buckets. The idea is you can serve active content from one bucket, stage content in another bucket, the cutover the distribution from one bucket to the other.

Using origins that are s3 websites allows testing the static content in the preview bucket via a URL that doesn't do through cloudfront, so in theory you can use bucket policies that restrict access to your s3 bucket. Normal users presumably won't have direct web access to the buckets.

The downside is your ip restrictions would have to include the cloud front addresses, which can change over time. For information on AWS IP adress ranges, see https://docs.aws.amazon.com/general/latest/gr/aws-ip-ranges.html.

