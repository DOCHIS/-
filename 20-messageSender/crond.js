global.config     = require('../config.json');
const discord     = require('./moduls/Discord-RestApi.js');
const momnet      = require('momnet');

// emoji
// let emoji_vote1  = '048%3A861150942434295839';
// let emoji_vote2  = '050%3A861170174827823104';

let emoji_vote1  = '048%846366925864173599';
let emoji_vote2  = '050%846367942060670995';

let emoji_1     = '1%EF%B8%8F%E2%83%A3';
let emoji_2     = '2%EF%B8%8F%E2%83%A3';
let emoji_3     = '3%EF%B8%8F%E2%83%A3';
let emoji_4     = '4%EF%B8%8F%E2%83%A3';
let emoji_5     = '5%EF%B8%8F%E2%83%A3';
let emoji_6     = '6%EF%B8%8F%E2%83%A3';
let emoji_7     = '7%EF%B8%8F%E2%83%A3';
let emoji_8     = '8%EF%B8%8F%E2%83%A3';
let emoji_9     = '9%EF%B8%8F%E2%83%A3';
let emoji_10    = '10%EF%B8%8F%E2%83%A3';

// date
let format          ="MM/DD";
let date_Next_Wed   = momnet().day(3).format(format);
let date_Next_Thu   = momnet().day(4).format(format);
let date_Next_Sat   = momnet().day(6).format(format);
let date_Next_Sun   = momnet().day(7).format(format);

// etc
let cI, content;


/**
 * 아르고스 1팟
 */
func1();
function func1(){
    cI      = '837322575067349012';
    content     = "```\n";
    content    += "[1팟] 아르고스 1팟 (부캐가능/시간고정)\n";
    content    += "-------------------\n";
    content    += date_Next_Wed + " 수요일 아르고스 3페 9시 모험섬 이후 가실 분 감정표현 부탁드립니다!";
    content    += "\n```";

    discord.send({
        "content"       : content,
    }, cI, 'createReaction', {emoji:emoji_vote1});
    
    setTimeout(() => func2(), 2000);
}


/**
 * 아르고스 2팟
 */
function func2(){
    cI          = '837322575067349012';
    content     = "```\n";
    content    += "[2팟] 아르고스 2팟 (부캐가능/시간투표)\n";
    content    += "-------------------\n";
    content    += "- " + date_Next_Sat + "일 토요일 오후 07시 : 놀자에요\n";
    content    += "- " + date_Next_Sun + "일 일요일 오후 07시 : 놀자에요\n";
    content    += "- " + date_Next_Sat + "일 토요일 점심 12시 : 1번\n";
    content    += "- " + date_Next_Sun + "일 일요일 점심 12시 : 2번\n";
    content    += "- " + date_Next_Thu + "일 오후 7~9시 사이  : 3번\n";
    content    += "-------------------\n";
    content    += "ㄴ 참여가능하신 시간을 '모두' 투표해주세요.\n";
    content    += "ㄴ 원하시는 시간이 없으신 경우 '로톡방'에 문의\n";
    content    += "ㄴ 투표수가 가장 많은 시간에 갑니다!\n";
    content    += "ㄴ 확정은 " + date_Next_Thu + "에 안내드리겠습니다!\n";
    content    += "\n```";
    discord.send({
        "content"       : content,
    }, cI, 'createReaction', {emoji:[
        emoji_vote1,
        emoji_vote2,
        emoji_1,
        emoji_2,
        emoji_3
    ]});

    setTimeout(() => func3(), 2000);
}


/**
 * 발탄하드 1팟
 */
 function func3(){
     cI      = '825327562602971146';
     content     = "```\n";
     content    += "[1팟] 발탄하드 1팟 (부캐가능/시간고정)\n";
     content    += "-------------------\n";
     content    += date_Next_Wed + " 발탄 하드 참가인원 감정표현 부탁드립니다!";
     content    += "\n```";
 
     discord.send({
         "content"       : content,
     }, cI, 'createReaction', {emoji:emoji_vote1});
     
     setTimeout(() => func4(), 2000);
 }

/**
 * 발탄하드 2팟
 */
 function func4(){
    cI          = '825327562602971146';
    content     = "```\n";
    content    += "[2팟] 발탄하드 2팟 (부캐가능/시간투표)\n";
    content    += "-------------------\n";
    content    += "- " + date_Next_Wed + "일 수요일 오후 09시 : 놀자에요\n";
    content    += "- " + date_Next_Sat + "일 토요일 오후 07시 : 1번\n";
    content    += "- " + date_Next_Sun + "일 일요일 오후 07시 : 2번\n";
    content    += "- " + date_Next_Sat + "일 토요일 점심 12시 : 3번\n";
    content    += "- " + date_Next_Sun + "일 일요일 점심 12시 : 4번\n";
    content    += "- " + date_Next_Thu + "일 오후 7~9시 사이  : 5번\n";
    content    += "-------------------\n";
    content    += "ㄴ 참여가능하신 시간을 '모두' 투표해주세요.\n";
    content    += "ㄴ 원하시는 시간이 없으신 경우 '로톡방'에 문의\n";
    content    += "ㄴ 투표수가 가장 많은 시간에 갑니다!\n";
    content    += "ㄴ 확정은 " + date_Next_Thu + "에 안내드리겠습니다!\n";
    content    += "\n```";
    discord.send({
        "content"       : content,
    }, cI, 'createReaction', {emoji:[
        emoji_vote1,
        emoji_1,
        emoji_2,
        emoji_3,
        emoji_4,
        emoji_5,
    ]});

    setTimeout(() => func5(), 2000);
}


/**
 * 비아키스 1팟
 */
 function func5(){
     cI      = '860836315951267850';
     content     = "```\n";
     content    += "[1팟] 비아키스 \"하드\"팟 (부캐가능/시간고정)\n";
     content    += "-------------------\n";
     content    += date_Next_Wed + " 수요일 오후 9시 모험섬&아르고스 이후 비아키스  하드 참가인원 감정표현 부탁드립니다!";
     content    += "\n```";
 
     discord.send({
         "content"       : content,
     }, cI, 'createReaction', {emoji:emoji_vote1});
     
     setTimeout(() => func6(), 2000);
 }

 
/**
 * 비아키스 2팟
 */
 function func6(){
    cI          = '860836315951267850';
    content     = "```\n";
    content    += "[2팟] 비아키스 \"노말\"팟 (부캐가능/트라이수준팟/시간투표)\n";
    content    += "-------------------\n";
    content    += "- " + date_Next_Wed + "일 수요일 발탄 하드 이후 : 놀자에요\n";
    content    += "- " + date_Next_Sat + "일 토요일 오후 07시 : 1번\n";
    content    += "- " + date_Next_Sun + "일 일요일 오후 07시 : 2번\n";
    content    += "- " + date_Next_Sat + "일 토요일 점심 12시 : 3번\n";
    content    += "- " + date_Next_Sun + "일 일요일 점심 12시 : 4번\n";
    content    += "- " + date_Next_Thu + "일 오후 7~9시 사이  : 5번\n";
    content    += "-------------------\n";
    content    += "ㄴ 참여가능하신 시간을 '모두' 투표해주세요.\n";
    content    += "ㄴ 원하시는 시간이 없으신 경우 '로톡방'에 문의\n";
    content    += "ㄴ 투표수가 가장 많은 시간에 갑니다!\n";
    content    += "ㄴ 확정은 " + date_Next_Thu + "에 안내드리겠습니다!\n";
    content    += "\n```";
    discord.send({
        "content"       : content,
    }, cI, 'createReaction', {emoji:[
        emoji_vote1,
        emoji_1,
        emoji_2,
        emoji_3,
        emoji_4,
        emoji_5,
    ]});

    // setTimeout(() => func7(), 2000);
}