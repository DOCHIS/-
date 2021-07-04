const fetch           = require('node-fetch');
let API_URL           = "https://discord.com/api/v9";
let data              = null;
let channelId         = null;
let msgId             = null;
let channelsMessages  = [];
let token             = 'Bot ' + config.token;
console.log(token);
module.exports  = {
  // init
  init    : function(d){
    data        = d;
    channelId   = data.channelId;
    msgId       = data.msgId;

    return this;
  },

  // set token
  setToken  : function(token){
    token   = 'Bearer ' + token;
  },

  // delete
  delete  : function(RcI, RmI){
    let CI = RcI ? RcI : channelId;
    let MI = RmI ? RmI : msgId;

    fetch(API_URL + '/channels/' + CI + '/messages/' + MI, {
      method: 'delete',
      headers: {
        "Authorization" : token,
        "Content-Type"  : 'application/json'
      }
    })
    .then(res => res.json())
    .then(body => console.log(body));

    return this;
  },

  // deleteMulti (반드시 2개이상의 아이디 삭제시 사용할 것)
  deleteMulti   : function(RcI, RmIs){
    let CI  = RcI  ? RcI : channelId;
    let MIs = RmIs;
    if(RmIs.length < 2) return false;

    fetch(API_URL + '/channels/' + CI + '/messages/bulk-delete', {
      method: 'POST',
      headers: {
        "Authorization" : token,
        "Content-Type"  : 'application/json'
      },
      body: JSON.stringify({messages : MIs})
    })
    .then(res => res.json())
    .then(body => console.log(body));

    return this;
  },

  // edit
  edit    : function(params, RcI, RmI){
    let CI = RcI ? RcI : channelId;
    let MI = RmI ? RmI : msgId;

    fetch(API_URL + '/channels/' + CI + '/messages/' + MI, {
      method: 'patch',
      headers: {
        "Authorization" : token,
        "Content-Type"  : 'application/json'
      },
      body: JSON.stringify(params)
    })
    .then(res => res.json())
    .then(body => console.log(body));

    return this;
  },

  // cleanChannelsMessages (작성된지 14일이 지난 내용은 삭제 불가)
  cleanChannelsMessages: function(params, RcI, thisObj){
    let CI = RcI ? RcI : channelId;
    
    if(channelsMessages.length == 0){
      this.getChannelsMessages(params, CI, this.cleanChannelsMessages);
    } else if( channelsMessages[0] == "complete" ){
      return this;
    } else {

      // 메시지가 1개인 경우 sigle 삭제 api 사용
      if( channelsMessages.length == 1 ){
        // return thisObj.delete(CI, ids);
      } else {
        let ids   = [];
        for(key in channelsMessages){
          let row       = channelsMessages[key];
          let timestamp = Date.parse(row.timestamp);
          let now       = new Date().getTime();
          let check     = !(timestamp < (now - (60*60*24*13*1000)));

          if(check)
            ids.push(channelsMessages[key].id);
        }
        return thisObj.deleteMulti(CI, ids);
      }
    }
  },

  // Create Reaction
  createReaction  : function(params, emoji, RcI, RmI){
    let CI = RcI ? RcI : channelId;
    let MI = RmI ? RmI : msgId;

    fetch(API_URL + '/channels/' + CI + '/messages/' + MI + '/reactions/' + emoji + '/@me', {
      method: 'put',
      headers: {
        "Authorization" : token,
        "Content-Type"  : 'application/json'
      }
    })
    .then(res => res.json())
    .then(body => console.log(body));


    console.log(params, emoji, RcI, RmI);
  },

  // send
  send    : function(params, RcI, afterAction, afterActionParam){
    let CI = RcI ? RcI : channelId;

    fetch(API_URL + '/channels/' + CI + '/messages', {
      method: 'post',
      headers: {
        "Authorization" : token,
        "Content-Type"  : 'application/json'
      },
      body: JSON.stringify(params)
    })
    .then(res => res.json())
    .then(body => {
      console.log(body);
      if(afterAction == 'createReaction'){
        if(Array.isArray(afterActionParam.emoji)){
          let sl          = 0;
          for(key in afterActionParam.emoji){
            let row       = afterActionParam.emoji[key];
            let vm        = this;
                sl       += 500;
            setTimeout(function() { 
              vm.createReaction(afterActionParam, row, CI, body.id);
            }, sl);
          }
        } else{
          this.createReaction(afterActionParam, afterActionParam.emoji, CI, body.id);
        }
      }
    });

    return this;
  },

  ///////////////////////
  // callback 사용이 가능한 function
  //--------------------

  // getChannelsMessages
  getChannelsMessages: function(params, RcI, callback){
    let CI      = RcI ? RcI : channelId;
    let query   = Object.entries(params).map(e => e.join('=')).join('&');

    fetch(API_URL + '/channels/' + CI + '/messages' + '?' + query, {
      method: 'get',
      headers: {
        "Authorization" : token,
        "Content-Type"  : 'application/json'
      }
    })
    .then(res => res.json())
    .then(body => {
      if(body.length){
        channelsMessages    = body;
      } else {
        channelsMessages[0] = 'complete';
      }
      callback(params, CI, this);
    });

    return this;
  },
  
}