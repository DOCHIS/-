module.exports  = function(ReceiptHandle, Msg){
    let content   = Msg.msg.cleanContent;
    let point     = content.indexOf(" ");
    let commend   = point === -1 ? content : content.substring(0, point);
    

    if (commend === '!도움말' ||
      commend === '!help'   ||
      commend === '!명령어' ||
      commend === '.도움말' ||
      commend === '.help'   ||
      commend === '.명령어'
      )
      {
        
      }

};