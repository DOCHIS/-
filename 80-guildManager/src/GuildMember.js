
// lib
const config = require('../../config.json');
const mysql = require('mysql');
const sha256 = require('sha256');
const loastarkCrawler = require('./LoastarkCrawler');
const loacwr = new loastarkCrawler();


module.exports = function () {

  var db = null;
  function connect_db() {
    db = mysql.createConnection({
      host: config.mysql_host,
      user: config.mysql_user,
      password: config.mysql_password,
      database: config.mysql_database
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
   * master 길드원 목록을 가져옴
   */
  function getMasterMembmer(callback, params) {
    return query("select * from member_master", callback, params);
  }

  /**
   * [Promise] sha검증을 위해 회원목록 데이터를 json 형태로 가공
   */
  function getMasterMemberSha(nickname) {
    return new Promise((resolve, reject) => {
      loacwr.get_myCharecters(nickname).then(function (raw) {
        let newRaw = [];
        for (const [key, row] of Object.entries(raw.list)) {
          newRaw.push(row.name);
        }
        let json = JSON.stringify(newRaw);
        resolve({
          list: raw.list,
          json: json,
          sha: sha256(json)
        });
      });
    });
  }


  /**
   * syncMasterMemeber controller
   */
  function syncMasterMemeberController(error, data, params) {
    console.log(">>", params);

    // 1. db connect & load master member
    if (params == undefined) {
      connect_db();
      db.beginTransaction();
      query("delete from member_slave");
      getMasterMembmer(syncMasterMemeberController, { next: 'updateMasterMembmersSha' })
    }

    // 2. master member들의 sha update
    else if (params.next == 'updateMasterMembmersSha') {
      let prograssed = [];
      let i          = 0;
      let count      = 0;
      let timeOut    = null;
      for (const [key, row] of Object.entries(data)) {
        getMasterMemberSha(row.mb_nickname).then(function (sha) {
          query(`update member_master set mb_integrity = '${sha.sha}' where mb_nickname = '${row.mb_nickname}' limit 1`);

          // 해당 integrity에 대한 slave 케릭 목록 삭제
          if (prograssed.indexOf(sha.sha) === -1) {
            count   = count + sha.list.length;
            for (const [k, r] of Object.entries(sha.list)) { // 크롤링 로그와 slave 케릭 정보 추가
              let logData = JSON.stringify(r);
              let query1 = `insert into member_crawler_log
              set
                log_data        = '${logData}',
                mb_integrity    = '${sha.sha}',
                mb_server       = '${r.server}',
                mb_class        = '${r.class}',
                mb_guild        = '${r.guild}',
                mb_nickname     = '${r.name}',
                mb_pvpLevel     = '${r.pvpLevel}',
                mb_itemLevel    = '${r.itemLevel}' `;
              let query2 = `insert into member_slave
                set
                  mb_integrity  = '${sha.sha}',
                  mb_server     = '${r.server}',
                  mb_class      = '${r.class}',
                  mb_guild      = '${r.guild}',
                  mb_nickname   = '${r.name}',
                  mb_pvpLevel   = '${r.pvpLevel}',
                  mb_itemLevel  = '${r.itemLevel}' `;
              query(query1, (error, result) => {
                query(query2 + `, log_no = '${result.insertId}'`, () => {
                  i++;
                  console.log(">>", i, "/", count);
                  if(timeOut)
                  {
                    clearTimeout(timeOut);
                  }
                  timeOut = setTimeout(()=>{
                    console.log(">> commit run");
                    db.commit();
                  }, 30000);
                });
              });
              prograssed.push(data.sha);
            }
          }
        });
      }
    }


  }

  /**
   * 주 컨트롤러
   */
  return {
    syncMasterMemeber: () => { syncMasterMemeberController(); },
    memberItemLevelAlime: ()=>{}
  };
};