exports.blue = (event, context, callback) => {
    console.log('edge proto call');
    console.log(`event: ${JSON.stringify(event)}`);
    console.log(`context: ${JSON.stringify(context)}`);
    let request = event.Records[0].cf.request;

    //Always blue
    request.uri = '/blue' + request.uri;
    
    callback(null, request);
}

exports.green = (event, context, callback) => {
    console.log('edge proto call');
    console.log(`event: ${JSON.stringify(event)}`);
    console.log(`context: ${JSON.stringify(context)}`);
    let request = event.Records[0].cf.request;

    //Always green
    request.uri = '/green' + request.uri;
    
    callback(null, request);
}


