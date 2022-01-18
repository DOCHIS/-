const { Client, Intents }   = require('discord.js');
const { REST }              = require('@discordjs/rest')
const client                = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const config                = require('../config.json');
const raidSettlementClass   = require('./src/raidSettlement');
const managerClass          = require('./src/managerClass');



client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', msg => {

  // 명령어 추출
  let point     = msg.content.indexOf(" ");
  let commend   = point === -1 ? msg.content : msg.content.substring(0, point);
  let params    = point === -1 ? "" : msg.content.substring(point + 1, msg.content.length );
  let data      = "";
  
  // class ready
  const raidSettlement  = new raidSettlementClass(msg);
  const manager         = new managerClass(msg);

  if(commend == "")
    return false;
  
  console.log(`commend : ${msg.content} / ${commend} / ${params} \n`);

  /////////
  // commend routor
  switch(commend){
    case '!정산'     : return raidSettlement.index(params);
    case '!!등록'    : 
    case '!!삭제'    : 
    case '!!검색'    : 
    case '!!목록'    : return manager.index(commend, params);
  }

});

client.login(config.token);


// test
// const raidSettlement  = new raidSettlementClass(client);
// raidSettlement.index('녹청색');

