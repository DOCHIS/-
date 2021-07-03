const { Router }  = require('express');
const router      = Router();
const AWS         = require('aws-sdk');

// AWS Service Settup
AWS.config.update({
  accessKeyId         : config.aws_dynamodb_key_id,
  secretAccessKey     : config.aws_dynamodb_key_secret,
  region              : config.aws_dynamodb_region
});
var docClient   = new AWS.DynamoDB.DocumentClient();

// invite
router.use('/', (req, res) => {

  // state 검증
  let state = req.get('User-Agent').toLowerCase();
  if( state !== Buffer.from(req.query.state, 'base64').toString('ascii') ){
    let error       = {error:'검증실패', error_description: '보안검사를 실패하였습니다. 잠시 후 다시 시도해주세요.'}
    let errorParam  = Object.entries(error).map(([key, val]) => `${key}=${val}`).join('&');
    res.redirect('/invite/error?' + errorParam);
  }

  // 토큰 갱신 프로세스 시작
  const protocol    = process.env.NODE_ENV === 'production' ? 'https://' : 'http://'
  const redirectUri = protocol + req.headers.host + '/api/invite';
  console.log(redirectUri);
  let data          = {
    client_id     : config.CLIENT_ID,
    client_secret : config.CLIENT_SECRET,
    grant_type    : 'authorization_code',
    code          : req.query.code,
    redirect_uri  : redirectUri
  };
  let params = Object.entries(data).map(([key, val]) => `${key}=${val}`).join('&');

  fetch('https://discord.com/api/oauth2/token',{
    method  : 'POST',
    body    : params,
    headers : {
      'content-type'  : 'application/x-www-form-urlencoded'
    }
  })
  .then(res=> res.json())
  .then(json=>{
    if(json.error){
      let errorParam = Object.entries(json).map(([key, val]) => `${key}=${val}`).join('&');
      res.redirect('/invite/error?' + errorParam);
    } else {

      // 기존 데이터 검색
      var rParams = {
        TableName: 'node_bots',
        Key:{
            "systemChannelID": json.guild.system_channel_id
        }
      };
      docClient.get(rParams, function(err, row) {
        if (row) {
          // 기존 데이터가 있는 경우 삭제
          let dParams = {
            TableName : 'node_bots',
            Key: {
              systemChannelID: row.Item.systemChannelID
            },
          };
          docClient.delete(dParams);
        }
      });

      // let
      let expires  = + new Date();
          expires += json.expires_in;

      // params
      let params  = {
          TableName : 'node_bots',
          Item      : {
            'systemChannelID' : json.guild.system_channel_id,
            'expires'         : expires,
            'expires_in'      : json.expires_in,
            'scope'           : json.scope,
            'token_type'      : json.token_type,
            'access_token'    : json.access_token,
            'refresh_token'   : json.refresh_token,
            'guild'           : json.guild
          }
      };
      
      docClient.put(params, function(err, data) {
        if (err) {
          let error       = {error:'Server Error', error_description: '서버에 뭔가 에러가 발생하고 있습니다.'}
          let errorParam  = Object.entries(error).map(([key, val]) => `${key}=${val}`).join('&');

          console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
          res.redirect('/invite/error?' + errorParam);
        } else {
          res.redirect('/invite/complete');
        }
      });
    }
  })
})

module.exports = router
