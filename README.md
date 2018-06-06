# cfs3

Fun with cloud front and s3

* basics - single bucket origin
* doubledown - two buckets as origins, stack parameters to switch cache refresh target from one origin to the other
* edge - Edge function you can install on top of the basics distribution to log the data passed in a view request event
* bluegreen - cloud front distro with multiple s3 origins, edge function to set the origin on origin view request
* view-blue-green - single bucket origin, two folders (blue and green), two lambdas to route to blue/green, and a cloud formation stack that is parameterized with the lambda function to use for request routing.

Things to consider:

Cache settings and behaviors will determine when cloud front goes to the origin. You may need to force a cache refresh if you want to make sure updated content is pushed to the edge if waiting for the cache interval to expire is undesirable.
