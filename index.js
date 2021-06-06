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

    let emote = "";
    emote    += "[놀자에요], ";
    emote    += "[머쓱해요], ";
    emote    += "[뭐라구요], ";
    emote    += "[사랑해], ";
    emote    += "[웃기구요], ";
    emote    += "[웃프네요], ";
    emote    += "[정말이요], ";
    emote    += "[추천이요], ";
    emote    += "[화가나요], ";
    emote    += "[화이팅]";
    
    const embed = new MessageEmbed()
      .setColor('#0099ff')
    	.setTitle('따봉도치봇 명령어 목록')
    	.setURL('https://discord.gg/UXWQryf5xT')
    	.setAuthor('따봉도치봇', 'https://i.imgur.com/vmiJ8kQ.jpg', 'https://discord.gg/UXWQryf5xT')
    	.addFields(
        { name: "!도움말"           , value: "명령어 목록", inline: true },
        { name: "!섬마 닉네임"      , value: "섬의마음 수집현황", inline: true },
        { name: "!오페별 닉네임"    , value: "오르페우스의별 수집목록", inline: true },
        { name: "!거심 닉네임"      , value: "거인의심장 수집목록", inline: true },
        { name: "!미술품 닉네임"    , value: "위대한미술품 수집목록", inline: true },
        { name: "!모코코 닉네임"    , value: "모코코씨앗 수집목록", inline: true },
        { name: "!모험물 닉네임"    , value: "향해모험물 수집목록", inline: true },
        { name: "!징표 닉네임"      , value: "이그네시아의징표 수집목록", inline: true },
        { name: "!세계수 닉네임"    , value: "세계수의 잎 수집목록", inline: true },
        { name: "이모티콘"          , value: emote, inline: false }
      )
    	.setThumbnail('https://i.imgur.com/vmiJ8kQ.jpg')
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

  // 섬마 [닉네임]
  if (commend === '!섬마') {
    get_profile(msg, params, get_collection, send_summa);
  }

  // 오페별 [닉네임]
  if (commend === '!오페별') {
    get_profile(msg, params, get_collection, send_opebir);
  }

  // 거심 [닉네임]
  if (commend === '!거심') {
    get_profile(msg, params, get_collection, send_gusim);
  }

  // 미술품 [닉네임]
  if (commend === '!미술품') {
    get_profile(msg, params, get_collection, send_art);
  }

  // 모코코 [닉네임]
  if (commend === '!모코코') {
    get_profile(msg, params, get_collection, send_mokoko);
  }

  // 모험물 [닉네임]
  if (commend === '!모험물') {
    get_profile(msg, params, get_collection, send_mohummul);
  }

  // 징표 [닉네임]
  if (commend === '!징표') {
    get_profile(msg, params, get_collection, send_gingphoy);
  }

  // 세계수 [닉네임]
  if (commend === '!세계수') {
    get_profile(msg, params, get_collection, send_segeasu);
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
    callback(client, cheerio.load(response.data), profile);
  })
  .catch(function (error) {
    return false;
  });
}

// 객체를 query string으로 변환
function convert_queryString(object){
  return Object.entries(object).map(e => e.join('=')).join('&');;
}


////////////////////////////////////
// send functions
// =========================


// 섬마 디코로 전달
function send_summa(client, $, profile){
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
  const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`[${profile.pcName}]님의 섬의마음 수집현황`)
                .setThumbnail('https://i.imgur.com/vmiJ8kQ.jpg')
                .setFooter('문의는 헛삯#5433 으로 문의 / 명령어 목록 !명령어');
  let check_Y = "";
  let check_N = "";
  
  for (index in list) {
    let row  = list[index];
    if(row.check == '미획득'){
      check_N   += `${row.name}\n`;
    } else {
      check_Y   += `${row.name}\n`;
    }
  }
  embed.addFields(
    { name: `획득 (${data.nowCount}개)`, value: check_Y ? check_Y : "-", inline: true },
    { name: `미획득 (${data.maxCount-data.nowCount}개)`, value: check_N ? check_N : "-", inline: true }
  )

  client.channel.send(embed);
}


// 오페별 디코로 전달
function send_opebir(client, $, profile){
  let data      = {
    'nowCount'   : $("#lui-tab1-2 .now-count").text(),
    'maxCount'   : $("#lui-tab1-2 .max-count").text()
  };

  // 데이터 추출
  let list      = [];
  let listObj   = $("#lui-tab1-2 .list").find("li");
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
  const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`[${profile.pcName}]님의 오르페우스의별 수집현황`)
                .setThumbnail('https://i.imgur.com/vmiJ8kQ.jpg')
                .setFooter('문의는 헛삯#5433 으로 문의 / 명령어 목록 !명령어');
  let check_Y = "";
  let check_N = "";
  
  for (index in list) {
    let row  = list[index];
    if(row.check == '미획득'){
      check_N   += `${row.name}\n`;
    } else {
      check_Y   += `${row.name}\n`;
    }
  }
  embed.addFields(
    { name: `획득 (${data.nowCount}개)`, value: check_Y ? check_Y : "-", inline: true },
    { name: `미획득 (${data.maxCount-data.nowCount}개)`, value: check_N ? check_N : "-", inline: true }
  )

  client.channel.send(embed);
}


// 거심 디코로 전달
function send_gusim(client, $, profile){
  let data      = {
    'nowCount'   : $("#lui-tab1-3 .now-count").text(),
    'maxCount'   : $("#lui-tab1-3 .max-count").text()
  };

  // 데이터 추출
  let list      = [];
  let listObj   = $("#lui-tab1-3 .list").find("li");
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
  const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`[${profile.pcName}]님의 거인의 심장 수집현황`)
                .setThumbnail('https://i.imgur.com/vmiJ8kQ.jpg')
                .setFooter('문의는 헛삯#5433 으로 문의 / 명령어 목록 !명령어');
  let check_Y = "";
  let check_N = "";
  
  for (index in list) {
    let row  = list[index];
    if(row.check == '미획득'){
      check_N   += `${row.name}\n`;
    } else {
      check_Y   += `${row.name}\n`;
    }
  }
  embed.addFields(
    { name: `획득 (${data.nowCount}개)`, value: check_Y ? check_Y : "-", inline: true },
    { name: `미획득 (${data.maxCount-data.nowCount}개)`, value: check_N ? check_N : "-", inline: true }
  )

  client.channel.send(embed);
}


// 미술품 디코로 전달
function send_art(client, $, profile){
  let data      = {
    'nowCount'   : $("#lui-tab1-4 .now-count").text(),
    'maxCount'   : $("#lui-tab1-4 .max-count").text()
  };

  // 데이터 추출
  let list      = [];
  let listObj   = $("#lui-tab1-4 .list").find("li");
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
  const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`[${profile.pcName}]님의 위대한 미술품 수집현황`)
                .setThumbnail('https://i.imgur.com/vmiJ8kQ.jpg')
                .setFooter('문의는 헛삯#5433 으로 문의 / 명령어 목록 !명령어');
  let check_Y = "";
  let check_N = "";
  
  for (index in list) {
    let row  = list[index];
    if(row.check == '미획득'){
      check_N   += `${row.name}\n`;
    } else {
      check_Y   += `${row.name}\n`;
    }
  }
  embed.addFields(
    { name: `획득 (${data.nowCount}개)`, value: check_Y ? check_Y : "-", inline: true },
    { name: `미획득 (${data.maxCount-data.nowCount}개)`, value: check_N ? check_N : "-", inline: true }
  )

  client.channel.send(embed);
}


// 모코코 디코로 전달
function send_mokoko(client, $, profile){
  let data      = {
    'nowCount'   : $("#lui-tab1-5 .now-count").text(),
    'maxCount'   : $("#lui-tab1-5 .max-count").text()
  };

  // 데이터 추출
  let list      = [];
  let listObj   = $("#lui-tab1-5 .list").find("li");
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
  const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`[${profile.pcName}]님의 모코코 수집현황`)
                .setThumbnail('https://i.imgur.com/vmiJ8kQ.jpg')
                .setFooter('문의는 헛삯#5433 으로 문의 / 명령어 목록 !명령어');
  let check_Y = "";
  let check_N = "";
  
  for (index in list) {
    let row  = list[index];
    if(row.check == '미획득'){
      check_N   += `${row.name}\n`;
    } else {
      check_Y   += `${row.name}\n`;
    }
  }
  embed.setDescription(`수집 ${data.nowCount}개 / 전체 ${data.maxCount}개`);

  client.channel.send(embed);
}


// 모험물 디코로 전달
function send_mohummul(client, $, profile){
  let data      = {
    'nowCount'   : $("#lui-tab1-6 .now-count").text(),
    'maxCount'   : $("#lui-tab1-6 .max-count").text()
  };

  // 데이터 추출
  let list      = [];
  let listObj   = $("#lui-tab1-6 .list").find("li");
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
  const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`[${profile.pcName}]님의 향해 모험물 수집현황`)
                .setThumbnail('https://i.imgur.com/vmiJ8kQ.jpg')
                .setFooter('문의는 헛삯#5433 으로 문의 / 명령어 목록 !명령어');
  let check_Y = "";
  let check_N = "";
  
  for (index in list) {
    let row  = list[index];
    if(row.check == '미획득'){
      check_N   += `${row.name}\n`;
    } else {
      check_Y   += `${row.name}\n`;
    }
  }
  embed.addFields(
    { name: `획득 (${data.nowCount}개)`, value: check_Y ? check_Y : "-", inline: true },
    { name: `미획득 (${data.maxCount-data.nowCount}개)`, value: check_N ? check_N : "-", inline: true }
  )

  client.channel.send(embed);
}


// 징표 디코로 전달
function send_gingphoy(client, $, profile){
  let data      = {
    'nowCount'   : $("#lui-tab1-7 .now-count").text(),
    'maxCount'   : $("#lui-tab1-7 .max-count").text()
  };

  // 데이터 추출
  let list      = [];
  let listObj   = $("#lui-tab1-7 .list").find("li");
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
  const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`[${profile.pcName}]님의 이그네시아의 징표 수집현황`)
                .setThumbnail('https://i.imgur.com/vmiJ8kQ.jpg')
                .setFooter('문의는 헛삯#5433 으로 문의 / 명령어 목록 !명령어');
  let check_Y = "";
  let check_N = "";
  
  for (index in list) {
    let row  = list[index];
    if(row.check == '미획득'){
      check_N   += `${row.name}\n`;
    } else {
      check_Y   += `${row.name}\n`;
    }
  }
  embed.addFields(
    { name: `획득 (${data.nowCount}개)`, value: check_Y ? check_Y : "-", inline: true },
    { name: `미획득 (${data.maxCount-data.nowCount}개)`, value: check_N ? check_N : "-", inline: true }
  )

  client.channel.send(embed);
}


// 세계수 디코로 전달
function send_segeasu(client, $, profile){
  let data      = {
    'nowCount'   : $("#lui-tab1-8 .now-count").text(),
    'maxCount'   : $("#lui-tab1-8 .max-count").text()
  };

  // 데이터 추출
  let list      = [];
  let listObj   = $("#lui-tab1-8 .list").find("li");
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
  const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`[${profile.pcName}]님의 세계수의 잎 수집현황`)
                .setThumbnail('https://i.imgur.com/vmiJ8kQ.jpg')
                .setFooter('문의는 헛삯#5433 으로 문의 / 명령어 목록 !명령어');
  let check_Y = "";
  let check_N = "";
  
  for (index in list) {
    let row  = list[index];
    if(row.check == '미획득'){
      check_N   += `${row.name}\n`;
    } else {
      check_Y   += `${row.name}\n`;
    }
  }
  embed.addFields(
    { name: `획득 (${data.nowCount}개)`, value: check_Y ? check_Y : "-", inline: true },
    { name: `미획득 (${data.maxCount-data.nowCount}개)`, value: check_N ? check_N : "-", inline: true }
  )

  client.channel.send(embed);
}


client.login(config.token);