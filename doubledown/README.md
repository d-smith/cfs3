aws cloudformation create-stack \
--stack-name cf1 \
--template-body file://doubledown.yml \
--parameters ParameterKey=BucketNameOne,ParameterValue=foo97068one \
ParameterKey=BucketNameTwo,ParameterValue=foo97068two