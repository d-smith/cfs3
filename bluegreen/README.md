This project illustrates how the origin cane modified in an edge function. To play with this, first
instantiate the cloud front and origin part of the stack

<pre>
aws cloudformation create-stack \
--stack-name bg1 \
--template-body file://bluegreen.yml
</pre>

After creating the stack, update the origin you want to swap in via the edge function - you can get the bucket name part of the origin domain name from the cloud formation output. 

Note you can only do this for origin request events, you cannot do this for view requests as you can change the host header which means you'll get a cert error.

Next, use the jupyter notebook to install the edge function and associate it with the cloud front distribution,

