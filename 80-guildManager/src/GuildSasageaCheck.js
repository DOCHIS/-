const config              = require('../../config.json');
const mysql               = require('mysql');
const invenCrawlerClass   = require('./InvenCrawler');
const invenCwr            = new invenCrawlerClass();
const guildMemberClass    = require('./GuildMember');
const guildMember         = new guildMemberClass();
const discordRestClass    = require('./DiscordRest');
const discordRest         = new discordRestClass();

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
     * 검색용 키워드 목록을 반환함
     */
    getKeyword(){
      return new Promise((resolve, reject) => {
        let keywords = ['모두도망쳐','어서도망쳐','빨리도망쳐'];
        guildMember.getSlaveMembers().then((data)=>{
          for (const [key, row] of Object.entries(data)){
            keywords.push(row.mb_nickname);
          }
          resolve(keywords);
        }).catch(function (error) {
          console.log('error', error);
        });;
      });
      
    },

    /**
     * check
     */
    check(){
      let vm        = this;
      let timeout   = 0;
      this.getKeyword().then((keywords)=>{
        for (const [key, keyword] of Object.entries(keywords)){
          invenCwr.search(keyword).then((result)=>{
            console.log(">> search await : ", keyword , ` (timeout : ${timeout})`);
            timeout       += 250;
            setTimeout(()=>{
              console.log(">> search start : ", keyword);

              // result.length
              if(result.length){
                for (const [k, row] of Object.entries(result)){
                  vm.query(`select * from inven_crawler_log where log_link = '${row.link}' limit 1`).then((fetch)=>{
                    if(fetch == false){
                      vm.query(`
                      insert into inven_crawler_log
                        set
                          log_keyword       = '${keyword}',
                          log_title         = '${row.title}',
                          log_content       = '${row.content}',
                          log_board_name    = '${row.boardName}',
                          log_date          = '${row.date}',
                          log_link          = '${row.link}' `)
                      .catch(function (error) {
                        console.log('error', error);
                      });
                    }
                  });
                }
              } // result.length
            }, timeout);
          });
        }
      });
    },

    /**
     * send
     */
     send(){
        let vm          = this;
        let timeout     = 0;
        let sql         = `
          UPDATE inven_crawler_log
          SET
            log_discord_sned = 'Not'
          WHERE
            (
              REPLACE(log_title,' ','') NOT LIKE CONCAT('%', log_keyword ,'%') AND
              REPLACE(log_content,' ','') NOT LIKE CONCAT('%', log_keyword ,'%')
            )	OR
            log_board_name NOT IN ('로스트아크 인벤 서버 사건/사고 게시판', '로스트아크 인벤 이슈/토론/버그 게시판')
        `;
      this.query(sql).then((fetch)=>{
        this.query("select * from inven_crawler_log WHERE log_discord_sned = 'N' order by log_date asc").then((result)=>{
          
          for(const [k, row] of Object.entries(result)){
          
              let content   = `\`\`\`\n`;
                  content   +=`┏━━━━━━━━━━━━━━━━━━━━━━━ \n`;
                  content   +=`┃ [따봉도치봇 모니터링]\n`;
                  content   +=`┠───────────────────────\n`;
                  content   +=`┃ 검색키워드 : ${row.log_keyword}\n`;
                  content   +=`┠───────────────────────\n`;
                  content   +=`┃ 제목 : ${row.log_title}\n`;
                  content   +=`┃ 게시판 : ${row.log_board_name}\n`;
                  content   +=`┃ 작성일 : ${row.log_date}\n`;
                  content   +=`┠───────────────────────\n`;
                  content   +=`┃ 내용 : \n`;
                  content   +=`┃ ${row.log_content}\n`;
                  content   +=`┠───────────────────────\n`;
                  content   +=`┃ 링크 : ${row.log_link}\n`;
                  content   +=`┠───────────────────────\n`;
                  content   +=`┃ 이 메시지는 본길드/부길드에 있는 모든 케릭터명을 사사게에 검색하여 표시한 결과입니다.\n`;
                  content   +=`┃ 따봉도치봇은 약 20분 간격으로 사사게를 자동으로 확인합니다.\n`;
                  content   +=`┗━━━━━━━━━━━━━━━━━━━━━━━ \n`;
                  content   +=`\`\`\``;

              // D : 868883693874315345
              // P : 914196518372790282
              timeout += 2000;
              setTimeout(()=>{
                discordRest.send({content : content},'914196518372790282').then(data => {
                  if(data.messageId){
                    vm.query(`update inven_crawler_log set log_discord_sned = 'Y' where log_no = '${row.log_no}' limit 1`);
                  }
                });
              }, timeout)
          }

        });
      });
     }

  }
};