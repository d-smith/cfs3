'use strict';

module.exports.bucketHandler = (event, context, callback) => {
  console.log(`event is ${JSON.stringify(event)}`);
  callback(null, { message: 'everything was ok', event });
};
