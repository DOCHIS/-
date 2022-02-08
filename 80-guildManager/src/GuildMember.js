
// lib
const config = require('../../config.json');
const mysql = require('mysql');
const sha256 = require('sha256');
const loastarkCrawler = require('./LoastarkCrawler');
const loacwr = new loastarkCrawler();


module.exports = function () {

  var db = null;
  function connect_db(connection) {
    if(connection)
      return db = connection;
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
   * master 길드원 목록을 가져옴
   */
  function getMasterMembmer(callback, params) {
    return query("select * from member_master", callback, params);
  }

  /**
   * slave 길드원 목록을 가져옴
   */
   function getSlaveMembmer(callback, params) {
    return query("select * from member_slave", callback, params);
  }

  /**
   * [Promise] sha검증을 위해 회원목록 데이터를 json 형태로 가공
   */
  function getMasterMemberSha(nickname) {
    return new Promise((resolve, reject) => {
      loacwr.get_myCharecters(nickname).then(function (raw) {
        let newRaw = [];

        if(raw == false)
          return resolve(false); 

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
   * [22-02-08 Update] 로아 전투정보실의 IP 밴 정책으로 인하여
   * 기본 비동기로 처리되던 알고리즘을 동기형으로 수정하였습니다.
   */
  function syncMasterMemeberController(error, data, params) {
    let limit     = 1;

    // 1. db connect & load master member
    if (params == undefined) {
      connect_db();
      query(
        `select * from member_master order by updated_at asc limit ${limit}`,
        syncMasterMemeberController,
        { next: 'getMemberData' }
      );
    }

    // 2. member들의 캐릭터 정보 크롤링
    else if (params.next == 'getMemberData') {
      let updateList      = [];
      let count           = 0;
      for (const [key, row] of Object.entries(data)) {
        getMasterMemberSha(row.mb_nickname).then(function (sha) {
          let raw     = {
            ...{nick : row.mb_nickname},
            ...{list : [] },
            ...sha
          };
          updateList.push(raw);

          count++;
          if(limit == count)
            return syncMasterMemeberController(undefined, updateList, { next: 'updateMemberData' });
        });
      }
    }

    // 3. db에 반영
    else if(params.next == 'updateMemberData'){
      let sql = "";
      for (const [key, row] of Object.entries(data)) {
        if(row.list.length){
          // sql
          sql += `\n\n/* ${row.nick} */\n`;
          sql += `update member_master
                    set
                      mb_integrity  = '${row.sha}',
                      updated_at    = now()
                    where
                      mb_nickname   = '${row.nick}';\n`;
            sql += `delete from member_slave where mb_integrity = '${row.sha}';\n`;
          
          // 부캐정보 및 크롤링 로그
          for (k in row.list) {
            let r  = row.list[k];
            sql += `insert into member_crawler_log
                      set
                        mb_integrity    = '${row.sha}',
                        mb_server       = '${r.server}',
                        mb_class        = '${r.class}',
                        mb_guild        = '${r.guild}',
                        mb_nickname     = '${r.name}',
                        mb_pvpLevel     = '${r.pvpLevel}',
                        mb_itemLevel    = '${r.itemLevel}';\n`;
            sql += `insert into member_slave
                      set
                        mb_integrity  = '${row.sha}',
                        mb_server     = '${r.server}',
                        mb_class      = '${r.class}',
                        mb_guild      = '${r.guild}',
                        mb_nickname   = '${r.name}',
                        mb_pvpLevel   = '${r.pvpLevel}',
                        mb_itemLevel  = '${r.itemLevel}';\n`;
          }
        }
      }
      sql += `delete from member_slave
                where
                  mb_integrity NOT IN (
                    select mb_integrity from member_master group by mb_integrity
                  );`;
      query(sql);
      close_db();
      console.log(sql);
    }

  }

  /**
   * 주 컨트롤러
   */
  return {
    config:(db)=>{ connect_db(db); },
    syncMasterMemeber: () => { console.log(">> syncMasterMemeber"); syncMasterMemeberController(); },
    memberItemLevelAlime: ()=>{ console.log(">> memberItemLevelAlime"); },
    getSlaveMembers:(callback, params)=>{ console.log(">> getSlaveMembers"); getSlaveMembmer(callback, params); }
  };
};