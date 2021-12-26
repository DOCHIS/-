const config = require('../../config.json');
const mysql = require('mysql');
const invenCrawlerClass = require('./InvenCrawler');
const invenCwr = new invenCrawlerClass();
const guildMemberClass = require('./GuildMember');
const guildMember = new guildMemberClass();
const discordRestClass = require('./DiscordRest');
const discordRest = new discordRestClass();

module.exports = function () {

  var db = null;
  var discordTimeout = 0;
  var searchTimeout = 0;
  var mysqlTimeout = 0;
  function connect_db() {
    db = mysql.createConnection({
      host: config.mysql_host,
      user: config.mysql_user,
      password: config.mysql_password,
      database: config.mysql_database,
      multipleStatements: true
    });
  }
  function close_db() {
    db.connection.end();
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
   * getTimeout
   */
  function getTimeout(action, plustime) {
    plustime    = plustime ?? 500;
    if (action == 'discord') {
      return discordTimeout += plustime;
    } else if (action == 'search') {
      return searchTimeout += plustime;
    } else {
      return mysqlTimeout += plustime;
    }
  }

  /**
   * 검색용 키워드 목록을 반환함
   */
  function getKeyword(callback, params) {
    guildMember.getSlaveMembers(callback, params);
  }

  /**
   * slave 길드원들의 사사게 기록을 검색함
   */
  function searchSlaveMemeberSasagea(error, data, params) {
    discordTimeout      = 0;
    searchTimeout       = 0;
    mysqlTimeout        = 0;


    // 1. init && slave member목록 구하기
    if (params == undefined) {
      connect_db();
      guildMember.config(db);
      if (data == undefined) {
        getKeyword(memberRowsConvertKeyrows, {
          'addKeyword': ['모두도망쳐', '어서도망쳐', '빨리도망쳐'],
          'next': 'search',
          'callback': searchSlaveMemeberSasagea
        });
      } else {
        searchSlaveMemeberSasagea(undefined, data, {
          'next': 'search'
        });
      }
    }

    // 2. 간격을 두고 검색
    if (params?.next == 'search') {
      for (const [key, keyword] of Object.entries(data)) {
        let st = getTimeout('search');
        console.log("set [st] ", st);
        setTimeout(() => {
          searchSasagea(keyword, searchSlaveMemeberSasagea, { next: 'send' });
        }, st);
      }
    }

    // 3. 디스코드로 알림 전송
    if (params?.next == 'send') {
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
      `;
      query(sql, (error, result) => {
        result    = result[1];
        for (const [k, row] of Object.entries(result)) {
          query(`update inven_crawler_log set log_discord_sned = 'Y' where log_no = '${row.log_no}' limit 1`);

          let content = `\`\`\`\n`;
          content += `┏━━━━━━━━━━━━━━━━━━━━━━━ \n`;
          content += `┃ [따봉도치봇 모니터링]\n`;
          content += `┠───────────────────────\n`;
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
          content += `┠───────────────────────\n`;
          content += `┃ 이 메시지는 본길드/부길드에 있는 모든 케릭터명을 사사게에 검색하여 표시한 결과입니다.\n`;
          content += `┃ 따봉도치봇은 약 20분 간격으로 사사게를 자동으로 확인합니다.\n`;
          content += `┗━━━━━━━━━━━━━━━━━━━━━━━ \n`;
          content += `\`\`\``;

          // D : 920311624508780564
          // P : 914196518372790282
          dt = getTimeout('discord');
          console.log("set [dt] ", dt);
          setTimeout(() => {
            discordRest.send({ content: content }, '920311624508780564');
          }, dt);
        }
      });
    }
  }

  /**
   * members 
   */
  function memberRowsConvertKeyrows(error, data, params) {
    let keywords = [];
    for (const [key, row] of Object.entries(data)) {
      keywords.push(row.mb_nickname);
    }

    if (params.addKeyword)
      keywords = [...keywords, ...params.addKeyword];

    params.callback(undefined, keywords, params);
  }

  /**
   * 사사게 게시판 검색
   */
  function searchSasagea(keyword, callback, params) {
    console.log(`>> search (${keyword})\tstart`);
    invenCwr.search(keyword).then((result) => {
      console.log(`>> search (${keyword})\tend (count:${result.length})`);

      let cnt = 0;
      if (result.length) {
        for (const [k, row] of Object.entries(result)) {
          query(`select * from inven_crawler_log where log_link = '${row.link}' limit 1`, (error, fetch) => {
            cnt++;
            if (fetch == false) {
              query(`
              insert into inven_crawler_log
                set
                  log_keyword       = '${keyword}',
                  log_title         = '${row.title}',
                  log_content       = '${row.content}',
                  log_board_name    = '${row.boardName}',
                  log_date          = '${row.date}',
                  log_link          = '${row.link}' `, () => {
                params.link = row.link;
                callback(undefined, keyword, params);
              });
            }
          });
        }
      } // result.length
    });
  }

  /**
   * 주 컨트롤러
   */
  return {
    search: (keyword) => { searchSlaveMemeberSasagea(undefined, keyword ? [keyword] : undefined); },
  };
};