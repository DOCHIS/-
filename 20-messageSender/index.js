const GeneralComments    = require('./comments/GeneralComments');
const RoaComments        = require('./comments/RoaComments');
global.config            = require('../config.json');
global.AWS               = require('aws-sdk');
global.eventLisner       = require('./moduls/EventLisner');


// aws
AWS.config.update({
  accessKeyId     : config.aws_sqs_key_id,
  secretAccessKey : config.aws_sqs_key_secret,
  region          : config.aws_sqs_region
});

// discord
const discord     = require('./moduls/Discord-RestApi.js');
global.discord    = discord;

// Event 컨트롤러
// var event     = eventLisner(SuccessEvent, ErrorEvent); 

// test
SuccessEvent({
  ResponseMetadata: { RequestId: 'da14c2d6-a513-55b4-bb6d-9b8df4ae5641' },
  Messages: [
    {
      MessageId: '7a671979-7267-4064-b0d9-754b46ee9330',
      ReceiptHandle: 'AQEBe0ZaUzXJr+eIzG3jT2LwDOFoomJ7WJUR6eQ0B6BRYVH46R8f8RlnWs3k+7AedrhIrEfQcHIVFoGQfLeqDtwgvw2OfnQ3xC6z7+Bzv0WtS5sEyA3W776nYxqAKsnZd0hivf5aFEPL0y+5y1CzH142r0CBJ2cdXl3d7cm62mLKPT1GJtoOdVollczD5K7Levy8TU/qJE2Ak+iGpYxCGEFbgr2ntwZe06cVW9OghJmZssA6sEzhGAhsrZQyOT7NqwzXry6Ob8+T7LFLSUa/47sNpo25M3h1q10e4rKZ/GPKguj8eCw5fRWlwiqKKgQ8/RzZPjdi4AvrJWbsPH5VJCLXuaY2wCswkx9BFfnmKO0E5GDFGR79Zmnfsf1gpaVMhv//9MdIKOLnzYjIPZDwYUHjMQ==',
      MD5OfBody: '27734b6f93595d38a9bf04f9cf59ecf8',
      Body: '{"msgId":"861125346229485568","channelId":"851033590741729340","msg":{"channelID":"851033590741729340","deleted":false,"id":"861125344895041536","type":"DEFAULT","system":false,"content":"!1","authorID":"405717261471580160","pinned":false,"tts":false,"nonce":"861125300895875072","embeds":[],"attachments":[],"createdTimestamp":1625378681158,"editedTimestamp":0,"webhookID":null,"applicationID":null,"activity":null,"flags":0,"reference":null,"guildID":"849876250952204309","cleanContent":"!1"}}',
      MD5OfMessageAttributes: 'eaf5b88b3de8a495e6e5b758a0c8b0fe',
      MessageAttributes: [Object]
    }
  ]
});

function SuccessEvent(event){
  let i             = 0;
  let singleEvent   = {
    ResponseMetadata      : event.ResponseMetadata,
    Message               : event.Messages[i]
  }
  SuccessEventRouter(singleEvent);
}

function SuccessEventRouter(event){
  let body = JSON.parse(event.Message.Body);

  if( body.msgId == 'server' ){
    console.log("type");
  } else {
    let content   = body.msg.cleanContent;
    let point     = content.indexOf(" ");
    let commend   = point === -1 ? content : content.substring(0, point);
    
  //   switch(commend){

  //     // help
  //     case '!도움말'    : 
  //     case '!help'      : 
  //     case '!명령어'    : 
  //     case '.도움말'    : 
  //     case '.help'      : 
  //     case '.명령어'    : GeneralComments(event); break;

  //     // 인게임 검색
  //     case '!섬마'      : 
  //     case '!오페별'    : 
  //     case '!거심'      : 
  //     case '!미술품'    : 
  //     case '!모코코'    : 
  //     case '!징표'      : 
  //     case '!세계수'    : RoaComments(event); break;

  //     // 기타명령어
  //     case '!테스트'             :
  //     case '!따봉도치야고마워'    : GeneralComments(event); break;
  //   }
  }

  let test = {
    "content": "<@" + body.msg.authorID + "> 11",
    "tts": false,
    "embeds": [],
  };
  discord.init(body).cleanChannelsMessages({limit:100});
}

function ErrorEvent(Error){
  console.log(Error);
}