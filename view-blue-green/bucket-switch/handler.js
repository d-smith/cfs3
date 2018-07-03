'use strict';

const AWS = require('aws-sdk');
const cloudformation = new AWS.CloudFormation();

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

const setRouter = async (router) => {
  console.log(`set router: ${router}`);
  console.log(`stack name: ${JSON.stringify(process.env.BG_STACK)}`);
  
  let params = {
    StackName: process.env.BG_STACK
  };

  let response = await cloudformation.describeStacks(params).promise();
  let stackOutputs = extractStackOutputs(response['Stacks'][0]['Outputs']);

  let currentRouter = getCurrentRouter(stackOutputs);

  console.log(currentRouter);

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
