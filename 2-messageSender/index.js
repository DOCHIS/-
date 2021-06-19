const config      = require('../config.json');
const AWS         = require('aws-sdk');

// AWS Service Settup
AWS.config.update({
    accessKeyId         : config.aws_sqs_key_id,
    secretAccessKey     : config.aws_sqs_key_secret,
    region              : config.aws_sqs_region
});
var sqs     = new AWS.SQS({apiVersion: '2012-11-05'});
var params  = {
    AttributeNames: [
        "Title"
    ],
    MaxNumberOfMessages: 10,
    MessageAttributeNames: [
        "All"
    ],
    QueueUrl: config.aws_sqs_url,
    VisibilityTimeout: 20,
    WaitTimeSeconds: 10
};


sqs.receiveMessage(params, function(err, data) {
    if (err) {
      console.log("Receive Error", err);
    } else if (data.Messages) {
      var deleteParams = {
        QueueUrl      : config.aws_sqs_url,
        ReceiptHandle : data.Messages[0].ReceiptHandle
      };
      sqs.deleteMessage(deleteParams, function(err, data) {
        if (err) {
          console.log("Delete Error", err);
        } else {
          console.log("Message Deleted", data);
        }
      });
    }
  });