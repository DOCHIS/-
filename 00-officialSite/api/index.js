const express     = require('express');
const cron        = require('node-cron');
global.config     = require('../../config.json');
global.fetch      = require("node-fetch");
global.Buffer     = global.Buffer || require('buffer').Buffer;
global.AWS        = require('aws-sdk');

// AWS Service Settup
AWS.config.update({
  accessKeyId         : config.aws_dynamodb_key_id,
  secretAccessKey     : config.aws_dynamodb_key_secret,
  region              : config.aws_dynamodb_region
});
global.docClient  = new AWS.DynamoDB.DocumentClient();

// Create express instance
const app = express()

// Require API routes
const invite = require('./routes/invite')

// Import API Routes
app.use(invite)

// Export express app
module.exports = app

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3001
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on port ${port}`)
  })
}

/**
 * date format
 */
 function format(timestamp) {
  let date = new Date(timestamp * 1000);

  datevalues = [
    date.getFullYear(),
    date.getMonth()+1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
 ];

  return datevalues;
}


/**
 * token refresh cron
 */
workingRefresh    = false;
cron.schedule('*/10 * * * *', () => {
  if(workingRefresh == true){
    return false;
  } else {
    workingRefresh    = true;

    let now   = new Date().getTime();
    let check = now + (60*60*1000);  // 토큰 유효시간이 1시간 이하인것을 스캔

    // scan
    var params = {
      TableName               : "node_bots",
      FilterExpression        : "#check <= :value",
      ExpressionAttributeNames:{
          "#check"  : "expires"
      },
      ExpressionAttributeValues: {
          ":value"  : check
      }
    };

    // sacn fetch
    docClient.scan(params, refreshScanUtil);
  }
});


/**
 * [function]
 * token refresh cron
 */
function refreshScanUtil(err, data) {
  // err
  if (err) {
      console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
  } else {
    // print all the movies
    console.log("Scan succeeded.");

    // forEach
    data.Items.forEach(function(row) {
      let data = {
        'client_id'       : config.CLIENT_ID,
        'client_secret'   : config.CLIENT_SECRET,
        'grant_type'      : 'refresh_token',
        'refresh_token'   : row.refresh_token
      }
      let params = Object.entries(data).map(([key, val]) => `${key}=${val}`).join('&');

      fetch('https://discord.com/api/v8/oauth2/token',{
        method  : 'POST',
        body    : params,
        headers : {
          'content-type'  : 'application/x-www-form-urlencoded'
        }
      })
      .then(res=> res.json())
      .then(json=>{
        if(json.error){
          console.log("[refresh Error 1]", json.error);
        } else {
          // let
          let expires  = + new Date();
              expires += (json.expires_in * 1000);

          // token update
          var params = {
            TableName:'node_bots',
            Key:{
              "systemChannelID"   : row.systemChannelID
            },
            UpdateExpression: "set access_token=:a, expires=:b, expires_in=:c, refresh_token=:d",
            ExpressionAttributeValues:{
              ":a"  : json.access_token,
              ":b"  : expires,
              ":c"  : json.expires_in,
              ":d"  : json.refresh_token
            }
          };

          // update query
          docClient.update(params, function(err) {
            if (err) {
              console.log("[refresh Error2]", JSON.stringify(err, null, 2))
            }
          });
        }
      });
    });// forEach

    workingRefresh    = false;
  } // err else
}