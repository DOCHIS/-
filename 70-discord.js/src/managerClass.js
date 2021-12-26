const config = require('../../config.json');
const mysql = require('mysql');
const guildSasageaCheckClass = require('../../80-guildManager/src/GuildSasageaCheck');
const guildSasageaCheck = new guildSasageaCheckClass();
const loastarkCrawler = require('../../80-guildManager/src/LoastarkCrawler');
const loacwr = new loastarkCrawler();

// lib
module.exports = function (message) {

  var db = null;
  function connect_db() {
    db = mysql.createConnection({
      host: config.mysql_host,
      user: config.mysql_user,
      password: config.mysql_password,
      database: config.mysql_database,
      multipleStatements: true
    });
  }


  /**
   * sql 쿼리
   */
  function query(sql, callback, params) {
    return db.query(sql, function (err, rows) {
      if (callback) callback(err, rows, params);
    });
  }

  /**
     * 길드원 목록정보 보기
     */
  function printMemberList(error, rows) {
    let i = 1;
    let content = '```\n';
    content += `💚 현재 따봉도치봇에 등록된 길드원(본길드)은 모두 ${rows.length}명 입니다.\n`;
    content += `━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    content += `< 목록 >\n`;
    rows.forEach((row) => {
      content += `${i}. ${row.mb_nickname}\n`;
      i++;
    });
    content += '```';
    return message.channel.send(content);
  }

  /**
   * 길드원 추가를 성공한 경우
   */
  function membmerAddSuccess(error, rows, params) {
    return message.channel.send(`\`\`\`\n✅ ${params.nickname}님을 따봉도치봇에 등록했습니다.\`\`\``);
  }

  /**
   * 길드원 추가를 실패한 경우
   */
  function membmerAddFail(errorMsg) {
    return message.channel.send(`\`\`\`\n${errorMsg}\`\`\``);
  }

  /**
   * 길드원 삭제를 성공한 경우
   */
  function membmerDeleteSuccess(error, rows, params) {
    return message.channel.send(`\`\`\`\n❌ ${params.nickname}님을 따봉도치봇에서 삭제했습니다.\`\`\``);
  }

  /**
   * 길드원 삭제를 실패한 경우
   */
  function membmerDeleteFail(errorMsg) {
    return message.channel.send(`\`\`\`\n${errorMsg}\`\`\``);
  }

  /**
   * 기다리라는 내용의 팝업 발송
   */
  function sendMessage(msg, timeDelete) {
    if (timeDelete) {
      return message.channel.send(`\`\`\`\n${msg}\`\`\``).then(msg => {
        setTimeout(() => msg.delete(), timeDelete)
      });
    }
    return message.channel.send(`\`\`\`\n${msg}\`\`\``);
  }


  return {

    /**
     * 메인 컨트롤러
     */
    index(commend, params) {
      connect_db();

      let check = message.member.roles.cache.filter(i => i.name === '길드장' || i.name === '부길드장');
      if (check.length == false)
        return message.channel.send(`\`\`\`\🚫 해당 명령어는 길드장 또는 부길드장 전용명령어 입니다.\`\`\``);

      switch (commend) {
        case '!!목록':
          return this.getMemberList(undefined, printMemberList);

        case '!!검색':
          return this.searchSasagea(params);

        case '!!등록':
          return this.addMember(params, {
            successCallback: membmerAddSuccess,
            failCallback: membmerAddFail
          });

        case '!!삭제':
          return this.deleteMember(params, {
            successCallback: membmerDeleteSuccess,
            failCallback: membmerDeleteFail
          });
      }
    },


    /**
     * 길드원 목록 뽑기
     */
    getMemberList(params, callback) {
      return query("select * from member_master", callback);
    },

    /**
     * 길드원 추가
     */
    addMember(nickname, callback) {
      let subparam = { nickname: nickname };
      let params = { ...callback, ...subparam };
      return query(`select * from member_master where mb_nickname = '${nickname}' limit 1`, this.addMember__after, params);
    },
    addMember__after(error, rows, params) {
      if (rows.length)
        return params.failCallback(`🚫 이미 ${params.nickname}님은 따봉도치봇에 등록되어있습니다`);

      return query(`insert into member_master set mb_nickname = '${params.nickname}' `, params.successCallback, params);
    },

    /**
     * 길드원 삭제
     */
    deleteMember(nickname, callback) {
      let subparam = { nickname: nickname };
      let params = { ...callback, ...subparam };
      return query(`select * from member_master where mb_nickname = '${nickname}' limit 1`, this.deleteMember__after, params);
    },
    deleteMember__after(error, rows, params) {
      if (rows.length == false)
        return params.failCallback(`🚫 ${params.nickname}님은 따봉도치봇에 등록되어있지 않습니다.`);

      return query(`delete from member_master where mb_nickname = '${params.nickname}' `, params.successCallback, params);
    },

    /**
     * 길드원 사사게 검색
     */
    searchSasagea(nickname) {
      sendMessage(`⏳ 검색중입니다 (최대 15초 소요)`);

      loacwr.get_myCharecters(nickname).then(function (raw) {
        if (raw == false)
          return sendMessage(`🚫 전투정보실에서 ${nickname}의 검색을 실패했습니다. 닉네임을 확인해주세요.`);

        let newRaw = [];
        for (const [key, row] of Object.entries(raw.list)) {
          newRaw.push(row.name);
        }

        let listStr = newRaw.join(", ");
        sendMessage(`⏳ 전투정보실에서 총 ${newRaw.length}개를 찾았습니다.\n[${listStr}]`);
        sendMessage(`⏳ 해당 케릭터들에 대한 사사게 검색을 시작합니다. (최대 15초 소요)`);

        timeOut = setTimeout(()=>{
          sendMessage(`✅ 검색결과를 모두 출력하였습니다.`);
        }, 10000);

        guildSasageaCheck.search(newRaw, {
          sendCallback: (error, data, params) => {
            if(timeOut)
              clearTimeout(timeOut);
            timeOut = setTimeout(()=>{
              sendMessage(`✅ 검색결과를 모두 출력하였습니다.`);
            }, 5000);
            
            let sql = `
            UPDATE inven_crawler_log
            SET
              log_discord_sned = 'Not'
            WHERE
              (
                REPLACE(log_title,' ','') NOT LIKE CONCAT('%', log_keyword ,'%') AND
                REPLACE(log_content,' ','') NOT LIKE CONCAT('%', log_keyword ,'%')
              )	OR
              log_board_name NOT IN ('로스트아크 인벤 서버 사건/사고 게시판', '로스트아크 인벤 이슈/토론/버그 게시판');

            select * from inven_crawler_log
            WHERE 
              log_discord_sned = 'N' AND
              log_link = '${params.link}'
            order by
              log_date asc ;

            delete from inven_crawler_log where log_link = '${params.link}' limit 1
          `;

            query(sql, (error, result) => {
              result = result[1];
              for (const [k, row] of Object.entries(result)) {

                let content = `\n`;
                content += `┏━━━━━━━━━━━━━━━━━━━━━━━ \n`;
                content += `┃ 검색키워드 : ${row.log_keyword}\n`;
                content += `┠───────────────────────\n`;
                content += `┃ 제목 : ${row.log_title}\n`;
                content += `┃ 게시판 : ${row.log_board_name}\n`;
                content += `┃ 작성일 : ${row.log_date}\n`;
                content += `┠───────────────────────\n`;
                content += `┃ 내용 : \n`;
                content += `┃ ${row.log_content}\n`;
                content += `┠───────────────────────\n`;
                content += `┃ 링크 : ${row.log_link}\n`;
                content += `┗━━━━━━━━━━━━━━━━━━━━━━━ \n`;

                // D : 920311624508780564
                // P : 914196518372790282
                sendMessage(content);
              }
            });
          }
        });
      });
    }



  }
}