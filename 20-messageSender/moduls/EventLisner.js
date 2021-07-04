module.exports  = function(callback, errorCallback ){
  var sqs     = new AWS.SQS({apiVersion: '2012-11-05'});
  var params    = {
    AttributeNames: [
      "Title"
    ],
    MaxNumberOfMessages: 1,
    MessageAttributeNames: [
      "All"
    ],
    QueueUrl: config.aws_sqs_url,
    VisibilityTimeout : 20,
    WaitTimeSeconds   : 10
  };

  sqs.receiveMessage(params, function(err, event) {
    if (err) {
      errorCallback("Receive Error", err);
    } else if (event.Messages) {
      callback(event);
      // var deleteParams = {
      //   QueueUrl    : config.aws_sqs_url,
      //   ReceiptHandle : data.Messages[0].ReceiptHandle
      // };
      // sqs.deleteMessage(deleteParams, function(err, data) {
      //   if (err) {
      //   console.log("Delete Error", err);
      //   } else {
      //   console.log("Message Deleted", data);
      //   }
      // });
    }
  });
}