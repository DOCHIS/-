const config = require('../../config.json');
const fetch = require('node-fetch');

module.exports = function () {
  let API_URL = "https://discord.com/api/v9";
  let data = null;
  let channelId = null;
  let msgId = null;
  let channelsMessages = [];
  let token = 'Bot ' + config.token;

  return {

    // Create Reaction
    createReaction: function (params, emoji, RcI, RmI) {
      let CI = RcI ? RcI : channelId;
      let MI = RmI ? RmI : msgId;

      fetch(API_URL + '/channels/' + CI + '/messages/' + MI + '/reactions/' + emoji + '/@me', {
        method: 'put',
        headers: {
          "Authorization": token,
          "Content-Type": 'application/json'
        }
      })
        .then(res => res.json())
        .then(body => console.log(body));
    },

    // send
    send: function (params, RcI, afterAction, afterActionParam) {
      return new Promise((resolve, reject) => {
        let CI = RcI ? RcI : channelId;

        fetch(API_URL + '/channels/' + CI + '/messages', {
          method: 'post',
          headers: {
            "Authorization": token,
            "Content-Type": 'application/json'
          },
          body: JSON.stringify(params)
        })
          .then(res => res.json())
          .then(body => {
            if (afterAction) {
              // afterAction == 'createReaction'
              if (afterAction == 'createReaction') {
                if (Array.isArray(afterActionParam.emoji)) {
                  let sl = 0;
                  for (key in afterActionParam.emoji) {
                    let row = afterActionParam.emoji[key];
                    let vm = this;
                    sl += 500;
                    setTimeout(function () {
                      vm.createReaction(afterActionParam, row, CI, body.id);
                    }, sl);
                  }
                } else {
                  this.createReaction(afterActionParam, afterActionParam.emoji, CI, body.id);
                }
              } // afterAction == 'createReaction'
              else {
                afterAction(body, params, afterActionParam);
              }
            } // afterAction
            resolve({
              channelId: CI,
              messageId: body.id
            });
          }); // then
      }); // Promise
    },

    // edit
    edit: function (params, RcI, RmI) {
      let CI = RcI ? RcI : channelId;
      let MI = RmI ? RmI : msgId;

      fetch(API_URL + '/channels/' + CI + '/messages/' + MI, {
        method: 'PATCH',
        headers: {
          "Authorization": token,
          "Content-Type": 'application/json'
        },
        body: JSON.stringify(params)
      })
        .then(res => res.json())
        .then(body => {
          return body;
        });
    },

    // delete
    delete: function (RcI, RmI) {
      let CI = RcI ? RcI : channelId;
      let MI = RmI ? RmI : msgId;

      fetch(API_URL + '/channels/' + CI + '/messages/' + MI, {
        method: 'DELETE',
        headers: {
          "Authorization": token,
          "Content-Type": 'application/json'
        },
      })
        .then(body => {
          return body;
        });
    }

  } // return
};