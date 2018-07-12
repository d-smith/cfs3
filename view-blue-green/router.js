
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

const showInactiveContent = (request) => {
    return request.headers['content-inactive'] != undefined;
}

const isContentPreview = (request) => {
    return request.headers['content-preview'] != undefined;
}

const processRequest = (active, inactive, event, context, callback) => {
    console.log('edge proto call');
    console.log(`event: ${JSON.stringify(event)}`);
    console.log(`context: ${JSON.stringify(context)}`);
    let request = event.Records[0].cf.request;

    //Is this just a query for the 'active' bucket partition?
    if(isActiveQuery(request)) {
        respondActive(active, callback);
        return;
    }

    //Is this a request using a direct path via the content-preview
    //header?
    if(isContentPreview(request)) {
        callback(null, request);
        return;
    }

    //If this is a request for inactive preview, direct the request to
    // the other partition, otherwise to the active partition
    if(showInactiveContent(request)) {
        request.uri = '/' + inactive + request.uri;
    } else {
        request.uri = '/' + active + request.uri;
    }
    
    callback(null, request);
}

exports.blue = (event, context, callback) => {
    processRequest('blue','green', event, context, callback);
}

exports.green = (event, context, callback) => {
    processRequest('green','blue', event, context, callback);
}


