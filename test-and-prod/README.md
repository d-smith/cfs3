# test-and-prod

Create a test stack with an s3 origin, then create a production distribution once the content has been validated. 

Themes of this stack:

* There is a stable production cloud front distribution known to clients/consumers.
* Production content is updated by switching the s3 bucket used as the origin for the distribution.
* Prior to updating the production content, a test stack can be spun up to validate the next version of the content. The production stack can be updated to point to the bucket associated with the test stack when testing has validated the content to be used in production.
* Test stacks can easily be spun up by dev team, allowing them to use the same topology and configuration as production stacks.
* Test and prod stacks can be associated with different WAFs. For example test stacks can be fronted with a WAF that allows access from the corporate network, production stacks can have WAF configuration appropriate to a production deploy.
* When the production stack is updated with a new bucket name, the production stacks creates a new bucket policy and associates it with the bucket, which means the test stack distribution no longer has access to the bucket.
* When the test stack is deleted, the bucket that was created when the stack was instantiated is not deleted.