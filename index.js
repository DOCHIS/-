const { Client, MessageEmbed, MessageAttachment } = require('discord.js');
const config    = require('./config.json');
const axios     = require('axios');
const cheerio   = require('cheerio');
const client    = new Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  let point     = msg.content.indexOf(" ");
  let commend   = point === -1 ? msg.content : msg.content.substring(0, point);
  let params    = point === -1 ? "" : msg.content.substring(point + 1, msg.content.length );
  let data      = "";
  
  if(commend == "")
    return false;
  
  console.log(`commend : ${msg.content} / ${commend} / ${params} \n`);

  /////////////////
  // 일반명령어
  // =============

  // help
  if (commend === '!도움말' ||
      commend === '!help'   ||
      commend === '!명령어' ||
      commend === '.도움말' ||
      commend === '.help'   ||
      commend === '.명령어'
      ) {
    data    += "**[ 일반명령어 ]**\n";
    data    += "!도움말 : 명령어 목록\n";
    data    += "!섬마 [닉네임] : 섬의마음 수집현황\n";
    data    += "!테스트 : 서버 응답속도 테스트\n";
    data    += "\n";
    data    += "**[ 이모티콘 ]**\n";
    data    += "[감격의눈물], ";
    data    += "[놀자에요], ";
    data    += "[머쓱해요], ";
    data    += "[뭐라구요], ";
    data    += "[사랑해], ";
    data    += "[웃기구요], ";
    data    += "[웃프네요], ";
    data    += "[정말이요], ";
    data    += "[추천이요], ";
    data    += "[화가나요], ";
    data    += "[화이팅]";
    
    const embed = new MessageEmbed()
      .setColor('#0099ff')
    	.setTitle('따봉도치봇 명령어 목록')
    	.setURL('https://discord.gg/UXWQryf5xT')
    	.setAuthor('따봉도치봇', 'https://i.imgur.com/vmiJ8kQ.jpg', 'https://discord.gg/UXWQryf5xT')
    	.setDescription(data)
    	.setImage('https://i.imgur.com/vmiJ8kQ.jpg')
    	.setFooter('문의는 헛삯#5433 으로 문의');
    msg.channel.send(embed);
  }
  
  // ping
  if (commend === '!테스트') {
    msg.reply('Pong! `' + Math.floor(client.uptime) + ' ms`');
  }
  
  // 따봉도치야고마워
  if (commend === '따봉도치야고마워') {
    msg.reply('https://www.youtube.com/watch?v=tk0fOgAiNI8');
  }

  // 모코코 [닉네임]
  if (commend === '!섬마') {
    get_profile(msg, params, get_collection, send_summa);
  }
  
  /////////////////
  // 이모티콘
  // =============

  if( msg.content.indexOf("[감격의눈물]") !== -1 ){
    const attachment = new MessageAttachment("https://i.imgur.com/ZtCtRMe.png");
    msg.reply(attachment);
  }

  if( msg.content.indexOf("[놀자에요]") !== -1 ){
    const attachment = new MessageAttachment("https://i.imgur.com/pBOkl3R.png");
    msg.reply(attachment);
  }

  if( msg.content.indexOf("[머쓱해요]") !== -1 ){
    const attachment = new MessageAttachment("https://i.imgur.com/59dGXym.png");
    msg.reply(attachment);
  }

  if( msg.content.indexOf("[뭐라구요]") !== -1 ){
    const attachment = new MessageAttachment("https://i.imgur.com/80M2Lfc.png");
    msg.reply(attachment);
  }

  if( msg.content.indexOf("[사랑해]") !== -1 ){
    const attachment = new MessageAttachment("https://i.imgur.com/AUoEM6q.png");
    msg.reply(attachment);
  }

  if( msg.content.indexOf("[웃기구요]") !== -1 ){
    const attachment = new MessageAttachment("https://i.imgur.com/xc4YoMZ.png");
    msg.reply(attachment);
  }

  if( msg.content.indexOf("[웃프네요]") !== -1 ){
    const attachment = new MessageAttachment("https://i.imgur.com/2GWoRO1.png");
    msg.reply(attachment);
  }

  if( msg.content.indexOf("[정말이요]") !== -1 ){
    const attachment = new MessageAttachment("https://i.imgur.com/Dtmxwxz.png");
    msg.reply(attachment);
  }

  if( msg.content.indexOf("[추천이요]") !== -1 ){
    const attachment = new MessageAttachment("https://i.imgur.com/1GBeu71.png");
    msg.reply(attachment);
  }

  if( msg.content.indexOf("[화가나요]") !== -1 ){
    const attachment = new MessageAttachment("https://i.imgur.com/nriASba.png");
    msg.reply(attachment);
  }

  if( msg.content.indexOf("[화이팅]") !== -1 ){
    const attachment = new MessageAttachment("https://i.imgur.com/v7VONHo.png");
    msg.reply(attachment);
  }
  
});


// 프로필 정보를 얻은 뒤 callback 함수로 전달
function get_profile(client, nick, callback1, callback2){
  axios.get("https://m-lostark.game.onstove.com/Profile/Character/" + encodeURI(nick), {})
  .then(function (response) {
    const data = {
      memberNo    : response.data.match(/(var \_memberNo \= \'*.+'?)/g),
      pcId        : response.data.match(/(var \_pcId \= \'*.+'?)/g),
      worldNo     : response.data.match(/(var \_worldNo \= \'*.+'?)/g),
      pcName      : response.data.match(/(var \_pcName \= \'*.+'?)/g),
      pvpLevel    : response.data.match(/(var \_pvpLevel \= \'*.+'?)/g)
    }

    for (const [key, value] of Object.entries(data)) {
      data[key]     = value[0].split("'")[1];
    }

    callback1(client, data, callback2);
  })
  .catch(function (client, error) {
    return false;
  });
}

// 수집형 포인트 정보 획득 후 callback 함수로 데이터 전달
function get_collection(client, profile, callback){
  let queryString = {
    memberNo    : profile.memberNo,
    worldNo     : profile.worldNo,
    pcId        : profile.pcId,
  };
  queryString     = convert_queryString(queryString);

  axios.get("https://m-lostark.game.onstove.com/Profile/GetCollection?" + queryString, {})
  .then(function (response) {
    callback(client, cheerio.load(response.data) );
  })
  .catch(function (error) {
    return false;
  });
}

// 객체를 query string으로 변환
function convert_queryString(object){
  return Object.entries(object).map(e => e.join('=')).join('&');;
}

// 섬마정보를 디코로 전달
function send_summa(client, $){
  let data      = {
    'nowCount'   : $("#lui-tab1-1 .now-count").text(),
    'maxCount'   : $("#lui-tab1-1 .max-count").text()
  };

  // 데이터 추출
  let list      = [];
  let listObj   = $("#lui-tab1-1 .list").find("li");
  listObj.each(function (index, elem) {
    let obj     = listObj.eq(index);
    let num     = obj.find("span").text();
    let check   = obj.find("em").text();
    let name    = obj.text();
        name    = name.substring( num.length, name.length - (num.length + check.length) + 1 );

    list.push({
      num     : num,
      name    : name,
      check   : check ? '획  득' : '미획득'
    });
  });

  // 디스코드로 전송
  let msg    = "";
  for (index in list) {
    let row  = list[index];
    msg     += `[${row.check}] - ${row.name}\n`;
  }
  msg   += `====================\n`;
  msg   += `섬마수집현황 ${data.nowCount} / ${data.maxCount}\n`;
  msg   += `====================\n`;

  client.channel.send(msg);
}

client.login(config.token);