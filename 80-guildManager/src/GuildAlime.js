const config              = require('../../config.json');
const mysql               = require('mysql');
const discordRestClass    = require('./DiscordRest');
const discordRest         = new discordRestClass();

// lib
module.exports = function () {
  return {

    /**
     * query
     */
     query(sql){
      return new Promise( (resolve, reject) => {
        console.log(">> sql(1) : ", sql);
        let connection = mysql.createConnection({
          host: config.mysql_host,
          user: config.mysql_user,
          password: config.mysql_password,
          database: config.mysql_database
        });
        
        connection.connect();
        connection.query(sql, function(err, rows){
          if (err) reject(err);
          resolve(rows);

          connection.end();
        });
        
      })
    },


    /**
     * 길드 맴버 아이템 레벨 상승 모니터링
     */
    memberItemLevelAlime(){
      let vm          = this;
      let timeout     = 500;
      this.query("select * from member_master").then((members)=>{
        members.forEach((member) => {
          let sql       = `
                            select
                              *
                            from
                              member_crawler_log
                            where
                                  mb_nickname = '${member.mb_nickname}'
                              AND mb_itemLevel is not null
                            group by mb_itemLevel
                            order by mb_itemLevel desc
                            limit 2
                            `;
          vm.query(sql).then((memberLogs)=>{
            if( memberLogs.length == 2)
            {
              let log_key   = 'memberItemLevelAlime';
              let log_id    = `${memberLogs[0].mb_nickname}|${memberLogs[1].mb_itemLevel}▶${memberLogs[0].mb_itemLevel}`;
              let check1    = memberLogs[0].mb_itemLevel > memberLogs[1].mb_itemLevel;
              vm.query(`select * from alime_send_log where log_key = '${log_key}' AND log_val = '${log_id}' limit 1`).then((check2)=>{
                if( check1 == true && check2.length == 0 )
                {
                  let content   = `\`\`\`\n`;
                      content   +=`┏━━━━━━━━━━━━━━━━━━━━━━━ \n`;
                      content   +=`┃ [따봉도치봇 알리미]\n`;
                      content   +=`┠───────────────────────\n`;
                      content   +=`┃ '${memberLogs[0].mb_nickname}'님께서\n`;
                      content   +=`┃ 강화에 성공하셨습니다!!\n`;
                      content   +=`┃ 축하드립니다!!\n`;
                      content   +=`┠───────────────────────\n`;
                      content   +=`┃ 내용 : ${memberLogs[1].mb_itemLevel}lV ▶ ${memberLogs[0].mb_itemLevel}lV\n`;
                      content   +=`┗━━━━━━━━━━━━━━━━━━━━━━━ \n`;
                      content   +=`\`\`\``;
                  
                  // D : 868883693874315345
                  // P : 915940475851137054
                  timeout     = timeout + 500;
                  setTimeout(()=>{
                    discordRest.send({content : content},'915940475851137054').then(async (data) => {
                      if(data.messageId){
                        vm.query(`insert into alime_send_log set log_key = '${log_key}', log_val = '${log_id}'`);
                      }
                    });
                  }, timeout);
                }
              });
            }
          }); // vm.query(sql)
        });// members.forEach
      }); // members query
    }, // memberItemLevelAlime()

  }
};