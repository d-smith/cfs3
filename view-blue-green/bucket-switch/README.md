# bucket-switch

Set the current routing function via dropping a directive in a bucket. This could be useful if you want to grant the ability to change routing from blue to green (and vice versa) based on bucket access without granting cloud formation or console access.

This uses the [serverless-external-s3-event](https://github.com/matt-filion/serverless-external-s3-event) plugin.

To deploy:

````console
npm install
sls deploy
sls s3deploy
````
