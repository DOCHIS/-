// 필요한 모델 불러오기
const cron                    = require('node-cron');
const guildMemberClass        = require('./src/GuildMember');
const guildMember             = new guildMemberClass();
const guildSasageaCheckClass  = require('./src/GuildSasageaCheck');
const guildSasageaCheck       = new guildSasageaCheckClass();
const guildAlimeClass         = require('./src/GuildAlime');
const guildAlime              = new guildAlimeClass();

// 매분 길드원 목록을 새로고침함
cron.schedule('0 * * * * * *', () => {
  guildMember.syncMasterMemeber();
});

// // [매시 00,10,20,30,40,50분] 알림을 발송함
cron.schedule('0 00,10,20,30,40,50 * * * * *', () => {
  guildAlime.memberItemLevelAlime();
});

// [매시 5분] 디스코드로 알림 전송
cron.schedule('0 05,15,25,35,45,55 * * * * *', () => {
  guildSasageaCheck.search();
});


// console.log(">> [000] | first search");
// guildSasageaCheck.search();
// guildMember.syncMasterMemeber();
// guildMember.memberItemLevelAlime();