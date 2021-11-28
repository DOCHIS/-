// 필요한 모델 불러오기
const cron                    = require('node-cron');
const guildMemberClass        = require('./src/GuildMember');
const guildMember             = new guildMemberClass();
const guildSasageaCheckClass  = require('./src/GuildSasageaCheck');
const guildSasageaCheck       = new guildSasageaCheckClass();

// 매일 새벽 4시에 길드원 목록을 새로고침함
cron.schedule('0 1 4 * * *', () => {
  guildMember.syncMasterMemeber();
});

// 10분마다 사사게 게시판을 검사함
cron.schedule('0 10,20,30,40,50 * * * * *', () => {
  guildSasageaCheck.check();
});

// 10분마다 디스코드로 알림 전송
cron.schedule('0 15,25,35,45,55 * * * * *', () => {
  guildSasageaCheck.send();
});
guildSasageaCheck.send();