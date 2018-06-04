

exports.handler = (event, context, callback) => {
    console.log('edge proto call');
    console.log(`event: ${JSON.stringify(event)}`);
    console.log(`context: ${JSON.stringify(context)}`);
    let request = event.Records[0].cf.request;
    callback(null, request);
}