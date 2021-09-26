
// lib
const config        = require('../config.json');
const fetch         = require('node-fetch');
const { Client }    = require('discord.js');
const mysql         = require('mysql');
const cron          = require('node-cron');
const momnet        = require('momnet');


// app init
const app        = require('./src/app');
const client     = new Client();
client.login(config.token);

let dc          = config.dc;
let dc_log      = config.dc_log;

// ===============================
// 매주 일요일 레이드 모집공지 송신
cron.schedule('* * * * *', () => {
    let now         = momnet().day(0).format("YYYY-MM-DD HH:mm:ss");
    console.log( ">> check : ", now);
});
cron.schedule('00 20 * * 0', () => {
    console.log( ">> Actice");
    let am      = app.msg.init();
        am      = app.msg.get();

    // 공지작성
    app.discordRest.send(am.line       , dc);

    // 카운트 다운
    let lim                 = 1000 * 3;
    let count               = (lim / 1000) - 2;
    setTimeout(() => {
        app.discordRest.send(app.msg.count(count), dc).then(data => {
            let countObj = setInterval(function() {
                count--;
                if( count >= 0){
                    app.discordRest.edit(app.msg.count( count ), data.channelId, data.messageId);
                } else {
                    clearInterval(countObj);
                    app.discordRest.delete( data.channelId, data.messageId );
                }
            }, 1000);
        }),
    2000});

    // 모집글 작성
    setTimeout(() => app.discordRest.send(app.msg.hr("==== ▼ 1팟 모집글 ========="), dc), (1000 * 00 ) + lim );
    setTimeout(() => app.vote.create(1, am.argos_1.content , dc , am.argos_1.emoji), (1000 * 01 ) + lim );
    setTimeout(() => app.vote.create(1, am.baltan_1.content, dc, am.baltan_1.emoji), (1000 * 03 ) + lim );
    setTimeout(() => app.vote.create(1, am.biakis_1.content, dc, am.biakis_1.emoji), (1000 * 05 ) + lim );
    setTimeout(() => app.vote.create(2, am.ab_1.content    , dc, am.ab_1.emoji    ), (1000 * 07 ) + lim );

    setTimeout(() => app.discordRest.send(app.msg.hr("==== ▼ 2팟 모집글 ========="), dc), (1000 * 09 ) + lim );
    setTimeout(() => app.vote.create(2, am.argos_2.content , dc , am.argos_2.emoji), (1000 * 10 ) + lim );
    setTimeout(() => app.vote.create(2, am.baltan_2.content, dc, am.baltan_2.emoji), (1000 * 15 ) + lim );
    setTimeout(() => app.vote.create(2, am.biakis_2.content, dc, am.biakis_2.emoji), (1000 * 20 ) + lim );

    setTimeout(() => app.discordRest.send(app.msg.hr("==== ▼ 기타 모집글 ========="), dc), (1000 * 25 ) + lim );
    setTimeout(() => app.vote.create(2, am.naruni.content  , dc, am.naruni.emoji  ), (1000 * 26 ) + lim );
    
    
    // 끝
    setTimeout(() => {
        app.discordRest.send(am.end, dc);
    }, (1000 * 35 ) + lim);

});


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
        reaction.message.channel.send('<@' + user.id + '> 님 해당 모집은 정원이 초과되었습니다.').then(msg => {
            setTimeout(() => msg.delete(), 5000)
        })
    } else {
        const emoji     = reaction.emoji;
        const snowflake = emoji.id ? `<:${emoji.name}:${emoji.id}>` : emoji.name;
        const reference = reaction.message.content.split('\n')[1];
        client.channels.cache.get(dc_log).send(`<@${user.id}> 님이 "${reference}"에 [${snowflake}]를 표시`);
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
    const reference = reaction.message.content.split('\n')[1];
    client.channels.cache.get(dc_log).send(`<@${user.id}> 님이 "${reference}"에 [${snowflake}]를 표시를 삭제함`);
});