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
}