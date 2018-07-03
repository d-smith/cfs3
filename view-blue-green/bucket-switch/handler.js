'use strict';


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

module.exports.bucketHandler = (event, context, callback) => {
  console.log(`event is ${JSON.stringify(event)}`);
  let records = event['Records'];
  let command = getRoutingCommand(records);
  
  if(command == undefined) {
    console.log('No routing command in events - exiting');
    callback(null, { message: 'no routing command', event });
  }

  console.log(`command is set routing to ${command}`);

  callback(null, { message: 'everything was ok', event });
};
