# bucket-switch

This is a [serverless application](https://serverless.com/) to switch the current routing function via dropping a directive in a bucket. This could be useful if you want to grant the ability to change routing from blue to green (and vice versa) based on bucket access without granting cloud formation or console access.

This uses the [serverless-external-s3-event](https://github.com/matt-filion/serverless-external-s3-event) plugin, and assumes the serverless framework and tooling have been installed (see [here](https://serverless.com/framework/docs/providers/aws/guide/installation/) for details on installing serverless)

To deploy:

````console
npm install
sls deploy
sls s3deploy
````

The stack update is triggered via dropping a file named `blue` or `green` in the bucket provided to the stack, which will update the stack to a the appropriate routing function.

Note this should be updated to narrow down the IAM policy and handle change requests while the previous stack update is in progress. This basic implementation, however, should give you the gist of what's possible.
