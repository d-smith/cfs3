
const isActiveQuery = (request) => {
    if(request.uri == '/' && request.querystring == 'active') {
        return true;
    }

    return false;
}

const respondActive = (active, callback) => {
    let response = {
        body: active,
        bodyEncoding: 'text',
        status: '200',
        statusDescription: 'OK'
    };

    callback(null, response);
}

const isContentPreview = (request) => {
    return request.headers['content-preview'] != undefined;
}

exports.blue = (event, context, callback) => {
    console.log('edge proto call');
    console.log(`event: ${JSON.stringify(event)}`);
    console.log(`context: ${JSON.stringify(context)}`);
    let request = event.Records[0].cf.request;

    if(isActiveQuery(request)) {
        respondActive('blue', callback);
        return;
    }

    //Always blue unless preview
    if(!isContentPreview(request)) {
        request.uri = '/blue' + request.uri;
    }
    
    callback(null, request);
}

exports.green = (event, context, callback) => {
    console.log('edge proto call');
    console.log(`event: ${JSON.stringify(event)}`);
    console.log(`context: ${JSON.stringify(context)}`);
    let request = event.Records[0].cf.request;

    if(isActiveQuery(request)) {
        respondActive('green', callback);
        return;
    }

    //Always green unless preview
    if(!isContentPreview(request)) {
        request.uri = '/green' + request.uri;
    }
    
    callback(null, request);
}


