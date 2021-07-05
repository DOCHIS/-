global.config     = require('./product.json');
const discord     = require('../20-messageSender/moduls/Discord-RestApi.js');;
const momnet      = require('momnet');

let emoji_vote1  = '048%3A861219825225039872';
let emoji_vote2  = '050%3A861219825286905866';

let emoji_1     = '1%EF%B8%8F%E2%83%A3';
let emoji_2     = '2%EF%B8%8F%E2%83%A3';
let emoji_3     = '3%EF%B8%8F%E2%83%A3';
let emoji_4     = '4%EF%B8%8F%E2%83%A3';
let emoji_5     = '5%EF%B8%8F%E2%83%A3';
let emoji_6     = '6%EF%B8%8F%E2%83%A3';
let emoji_7     = '7%EF%B8%8F%E2%83%A3';
let emoji_8     = '8%EF%B8%8F%E2%83%A3';
let emoji_9     = '9%EF%B8%8F%E2%83%A3';
let emoji_10    = '%F0%9F%94%9F';

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
    cI      = '814838555209629726';
    content     = "``` 혹혹이... 취업률... 낮아... ```";

    discord.send({
        "content"       : content,
    }, cI);
    
}