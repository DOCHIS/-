const config      = require('../config.json');
const { Client }  = require('discord.js');
const client      = new Client();
const AWS         = require('aws-sdk');

// AWS Service Settup
AWS.config.update({
    accessKeyId         : config.aws_sqs_key_id,
    secretAccessKey     : config.aws_sqs_key_secret,
    region              : config.aws_sqs_region
});
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});


client.on('message', msg => {
    var check  = msg.content.substring(0,1);
console.log(msg);
    if(check == "!" || check == "["){
        
        // 기다리라는 메시지 전송 후 대기열에 등록
        msg.reply(":hourglass_flowing_sand:```잠시만 기다리세요...```").then(sent => { // 'sent' is that message you just sent
            var data = {
                msgId           : sent.id,
                channelId       : msg.channel.id,
                msg             : msg
            };
            console.log(data);
            var params = {
                DelaySeconds        : 10,
                MessageAttributes   : {
                    "Title"         : {
                        DataType    : "String",
                        StringValue : "ddabong-dochi-event"
                    },
                    "Author"        : {
                        DataType    : "String",
                        StringValue : "ddabong-dochi-eventLisner"
                    },
                    "WeeksOn"       : {
                        DataType    : "Number",
                        StringValue : "6"
                    }
                },
                MessageBody         : JSON.stringify(data),
                QueueUrl            : config.aws_sqs_url
            };
            sqs.sendMessage(params, function(err, data) {
                if (err) {
                    console.log("Error", err, msg.content);
                } else {
                    console.log("Success", data.MessageId, msg.content);
                }
            });
        });
    }
});

client.login(config.token);