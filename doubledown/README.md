aws cloudformation create-stack \
--stack-name cf1 \
--template-body file://doubledown.yml \
--parameters ParameterKey=BucketNameOne,ParameterValue=foo97068one \
ParameterKey=BucketNameTwo,ParameterValue=foo97068two

Copy one.html into the one bucket and two.html into the two bucket, once with the given name, and once as foo.html. Instantiate the stack with one as the target, then read foo.html via the cloudfront URL- observe the one content. Update the stack with two as the target, wait for the cache time to expire (300 seconds) then get foo.html again - observe the two content.