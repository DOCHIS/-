// lib
const config     = require('../../config.json');

// method > emoji
const emoji     = {
    'cancel'            : '%E2%9D%8C',
    'list'              : [
        '0%EF%B8%8F%E2%83%A3',
        '1%EF%B8%8F%E2%83%A3',
        '2%EF%B8%8F%E2%83%A3',
        '3%EF%B8%8F%E2%83%A3',
        '4%EF%B8%8F%E2%83%A3',
        '5%EF%B8%8F%E2%83%A3',
        '6%EF%B8%8F%E2%83%A3',
        '7%EF%B8%8F%E2%83%A3',
        '8%EF%B8%8F%E2%83%A3',
        '9%EF%B8%8F%E2%83%A3',
        '10%EF%B8%8F%E2%83%A3',
        '%E2%9D%A4',
        '%F0%9F%A7%A1',
        '%F0%9F%92%9B',
        '%F0%9F%92%9A',
        '%F0%9F%92%99',
        '%F0%9F%92%9C',
        '%F0%9F%A4%8E',
        '%F0%9F%96%A4'
    ]
};


// method > crawler
const crawlerClass      = require("./crawler");
const crawler           = crawlerClass(config, emoji);

// method > vote
const voteClass         = require("./vote");
const vote              = voteClass(config, emoji);

// rest
const discordRestClass  = require("./discordRest");
const discordRest       = discordRestClass(config, emoji);

// msg
const msgClass          = require("./msg");
const msg               = msgClass(config, emoji).get();

module.exports = { emoji, crawler, vote, msg, discordRest };