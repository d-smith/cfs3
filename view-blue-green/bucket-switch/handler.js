'use strict';

const AWS = require('aws-sdk');
const cloudformation = new AWS.CloudFormation();


const stackNameFromId = (stackId) => {
  //Id looks like arn:aws:cloudformation:us-east-2:123456789012:stack/mystack-mynestedstack-sggfrhxhum7w/f449b250-b969-11e0-a185-5081d0136786
  let parts = stackId.split('/');
  if(parts.length != 3) {
    return undefined;
  }

  return parts[1];
}

const getCloudFrontDistroStackName = async () => {
  let prefix = process.env.BG_STACK + '-' + 'CloudFrontDistro';
  console.log(`Looking for stacks starting with ${prefix}`)
  let response = await cloudformation.describeStacks({}).promise();
  while(true) {
    let stacks = response['Stacks'];
    for(var s of stacks) {
      let stackName = s['StackName'];
      console.log(`stack is... ${stackName}`);
      if(stackName.startsWith(prefix)) {
        console.log('found it');
        return stackName;
      }
    }

    let nextToken = response['NextToken'];
    if(nextToken == null || nextToken == undefined) {
      console.log('not found');
      return undefined;
    }

    response = await cloudformation.describeStacks({NextToken: nextToken}).promise();
  }

}

const getRoutingCommand = (records) => {
  let command = undefined;

  records.forEach(r => {
    console.log(`record: ${JSON.stringify(r)}`);
    if(r['s3'] != undefined) {
      let key = r['s3']['object']['key'];
      switch(key) {
        case "blue":
        case "green":
          command = key;
          break;
        default:
          break;
      }
    }
  });

  return command;
}

const extractStackOutputs = (outputs) => {
  let stackOutputs = {};
  outputs.forEach(o => {
    stackOutputs[o['OutputKey']] = o['OutputValue'];
  });
  return stackOutputs;
}

const getCurrentRouter = (stackOutputs) => {
  if(stackOutputs['BlueLambdaArn'] == stackOutputs['ContentRouterArn']) {
    return "blue";
  }

  if(stackOutputs['GreenLambdaArn'] == stackOutputs['ContentRouterArn']) {
    return "green";
  }

  return undefined
}

const switchRouter = async (router, stackOutputs) => {
  let newRouterArn = '';
  if(router == 'green') {
    newRouterArn = stackOutputs['GreenLambdaArn'];
  } else {
    newRouterArn = stackOutputs['BlueLambdaArn'];
  }

  let stackName = await getCloudFrontDistroStackName();
  console.log(`updating stack name ${stackName} with lambda arn ${newRouterArn}`);

  let params = {
    StackName: stackName,
    UsePreviousTemplate: true,
    Parameters: [{
      ParameterKey: 'LambdaVersionArn',
      ParameterValue: newRouterArn
    }]
  };

  let response = await cloudformation.updateStack(params).promise();
  console.log(`update stack response: ${JSON.stringify(response)}`);
}

const setRouter = async (router) => {
  console.log(`set router: ${router}`);
  console.log(`stack name: ${JSON.stringify(process.env.BG_STACK)}`);
  
  let params = {
    StackName: process.env.BG_STACK
  };

  let response = await cloudformation.describeStacks(params).promise();
  let stackOutputs = extractStackOutputs(response['Stacks'][0]['Outputs']);

  let currentRouter = getCurrentRouter(stackOutputs);

  console.log(`current router: ${currentRouter}`);
  if(currentRouter != router) {
    console.log('switch routing functions');
    switchRouter(router, stackOutputs);
  } else {
    console.log('requested router currently in place - no change');
  }
}

module.exports.bucketHandler = async (event, context, callback) => {
  console.log(`event is ${JSON.stringify(event)}`);
  let records = event['Records'];
  let command = getRoutingCommand(records);
  
  if(command == undefined) {
    console.log('No routing command in events - exiting');
    callback(null, { message: 'no routing command', event });
  }

  console.log(`command is set routing to ${command}`);
  setRouter(command);

  callback(null, { message: 'everything was ok', event });
};
