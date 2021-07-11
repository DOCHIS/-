
// lib
const config        = require('../config.json');
const fetch         = require('node-fetch');
const { Client }    = require('discord.js');


// app init
const app        = require('./src/app');
const client     = new Client();
client.login(config.token);

let dc_log          = config.dc_log;
let dc_argos        = config.dc_argos;
let dc_baltan       = config.dc_baltan;
let dc_biakis       = config.dc_biakis;


// ===============================
// 매주 일요일 레이드 모집공지 송신
let am      = app.msg;

setTimeout(() => app.discordRest.send(am.line       , dc_argos )                     , 5000 * 0  );
setTimeout(() => app.discordRest.send(am.line       , dc_baltan)                     , 5000 * 0  );
setTimeout(() => app.discordRest.send(am.line       , dc_biakis)                     , 5000 * 0  );

setTimeout(() => app.vote.create(am.argos_1.content , dc_argos , am.argos_1.emoji)   , (5000 * 1) + 10000 );
setTimeout(() => app.vote.create(am.baltan_1.content, dc_baltan, am.baltan_1.emoji)  , (5000 * 2) + 10000 );
setTimeout(() => app.vote.create(am.biakis_1.content, dc_biakis, am.biakis_1.emoji)  , (5000 * 3) + 10000 );
setTimeout(() => app.vote.create(am.argos_2.content , dc_argos , am.argos_2.emoji)   , (5000 * 4) + 10000 );
setTimeout(() => app.vote.create(am.baltan_2.content, dc_baltan, am.baltan_2.emoji)  , (5000 * 5) + 10000 );
setTimeout(() => app.vote.create(am.biakis_2.content, dc_biakis, am.biakis_2.emoji)  , (5000 * 6) + 10000 );


// ===============================
// 투표내역 실시간 lisen
client.on('messageReactionAdd', async (reaction, user) => {
    const channelId = reaction.message.channel.id;
    const messageId = reaction.message.id;

    // 따봉도치봇이 한 리엑션에는 반응하지 않음
    if(user.username == '따봉도치봇' || user.username == '따봉도치봇 (테스트)')
        return false;

    // 리엑션 카운팅
    if(reaction.count == 10){
        reaction.users.remove(user.id);
        return reaction.message.channel.send('<@' + user.id + '> 님 해당 모집은 정원이 초과되었습니다.').then(msg => {
            setTimeout(() => msg.delete(), 5000)
        })
    } else {
        const emoji     = reaction.emoji;
        const snowflake = emoji.id ? `<:${emoji.name}:${emoji.id}>` : emoji.name;
        const reference = reaction.message.content.split('\n')[0];
        client.channels.cache.get(dc_log).send(`<@${user.id}> 님이 "${reference}"에 [${snowflake}]를 표시`);
    }

    // 케릭터 선택메시지에서 리엑션한 경우
    let check = reaction.message.content.split('\n')[0];
    if(check == "[선택해주세요]"){
        if( reaction.count == 2 ) {
            app.vote.voteApply(reaction, user);
        }
    }
    
    // 레이드 투표에 리엑션한 경우
    else {
        app.vote.getVote(channelId, messageId).then(function(vote) {
            if(vote){
                app.crawler.getCharacterPicker(reaction, user);
            }
        });
    }
});

// 투표취소
client.on('messageReactionRemove', async (reaction, user) => {

    // 따봉도치봇이 한 리엑션에는 반응하지 않음
    if(user.username == '따봉도치봇' || user.username == '따봉도치봇 (테스트)')
        return false;

    // 로깅
    const emoji     = reaction.emoji;
    const snowflake = emoji.id ? `<:${emoji.name}:${emoji.id}>` : emoji.name;
    const reference = reaction.message.content.split('\n')[0];
    client.channels.cache.get(dc_log).send(`<@${user.id}> 님이 "${reference}"에 [${snowflake}]를 표시를 삭제함`);

    // 투표한 내역을 찾아서 내역이 있다면 삭제
    app.vote.voteCancel(reaction, user);
});