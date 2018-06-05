exports.handler = (event, context, callback) => {
    console.log('edge proto call');
    console.log(`event: ${JSON.stringify(event)}`);
    console.log(`context: ${JSON.stringify(context)}`);
    let request = event.Records[0].cf.request;

    //Example of hard-coding origin - next will be forming this based on a lookup
    let s3DomainName = 'bg1-bluebucket-1oiwc3xnxyqzc.s3.amazonaws.com';

    request.origin = {
        s3: {
            domainName: s3DomainName,
            region: 'us-east-1',
            authMethod: 'origin-access-identity',
            path: '',
            customHeaders: {}
        }
    };
    request.headers['host'] = [{ key: 'host', value: s3DomainName}];

    callback(null, request);
}


