const config = require('../../config.json');
const mysql = require('mysql');
const calculator = require('./raidSettlementCalculator.js');

// lib
module.exports = function (message) {

  var db = null;
  function connect_db() {
    db = mysql.createConnection({
      host: config.mysql_host,
      user: config.mysql_user,
      password: config.mysql_password,
      database: config.mysql_database
    });
  }


  /**
   * sql 쿼리
   */
  function query(sql, callback, params) {
    return db.query(sql, function (err, rows) {
      callback(err, rows, params);
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


  return {

    /**
     * 메인 컨트롤러
     */
    index(commend, params) {
      connect_db();

      let check     = message.member.roles.cache.filter(i => i.name === '길드장' || i.name === '부길드장');
      if(check.length == false)
        return message.channel.send(`\`\`\`\🚫 해당 명령어는 길드장 또는 부길드장 전용명령어 입니다.\`\`\``);

      switch (commend) {
        case '!!목록':
          return this.getMemberList(undefined, printMemberList);

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
    }



  }
}