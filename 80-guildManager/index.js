// 필요한 모델 불러오기
const cron                    = require('node-cron');
const guildMemberClass        = require('./src/GuildMember');
const guildMember             = new guildMemberClass();
const guildSasageaCheckClass  = require('./src/GuildSasageaCheck');
const guildSasageaCheck       = new guildSasageaCheckClass();
const guildAlimeClass         = require('./src/GuildAlime');
const guildAlime              = new guildAlimeClass();

// [매시 08,18,28,38,48,58분] 길드원 목록을 새로고침함
cron.schedule('0 08,18,28,38,48,58 * * * * *', () => {
  guildMember.syncMasterMemeber();
});

// [매시 00,10,20,30,40,50분] 알림을 발송함
cron.schedule('0 00,10,20,30,40,50 * * * * *', () => {
  guildAlime.memberItemLevelAlime();
});

// [매시 45분] 사사게 게시판을 검사함
cron.schedule('0 45 * * * * *', () => {
  guildSasageaCheck.check();
});

// [매시 55분] 디스코드로 알림 전송
cron.schedule('0 55 * * * * *', () => {
  guildSasageaCheck.send();
});


// guildMember.syncMasterMemeber();
guildAlime.memberItemLevelAlime();