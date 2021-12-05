
// lib
const config              = require('../../config.json');
const mysql               = require('mysql');
const sha256              = require('sha256');
const loastarkCrawler     = require('./LoastarkCrawler');
const loacwr              = new loastarkCrawler();


module.exports = function () {
  return {

    /**
     * query
     */
     query(sql){
      return new Promise( (resolve, reject) => {
        console.log(">> sql(2) : ", sql);
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
     * 마스터 길드원 목록을 불러옴
     */
    getMasterMembers(){
      return new Promise( (resolve, reject) => {
        this.query("select * from `member_master`").then(function(response)
        {
          resolve(response);
        }).catch(function (error) {
          reject(error);
        });
      })
    },

    /**
     * 서브 길드원 목록을 불러옴
     */
    getSlaveMembers(){
      return new Promise( (resolve, reject) => {
        this.query("select * from member_slave").then(function(response)
        {
          resolve(response);
        }).catch(function (error) {
          console.log(">> error(from getSlaveMembers) : ", error);
        });
      })
    },

    /**
     * 마스터 길드원들의 sha값을 갱신함
     */
    syncMasterMemeber(){
      const vm = this;
      this.getMasterMembers().then(function(rows){
        let prograssed      = [];
        vm.query("delete from member_slave");

        for (const [key, row] of Object.entries(rows))
        {
          vm.util__masterSha(row.mb_nickname).then(function(data){

            // master 회원에 대한 integrity 업데이트
            vm.query(`update member_master set mb_integrity = '${data.sha}' where mb_nickname = '${row.mb_nickname}' limit 1`);
            
            // 해당 integrity에 대한 slave 케릭 목록 삭제
            if( prograssed.indexOf(data.sha) === -1 )
            {
              for (const [k, r] of Object.entries(data.list))
              {
                // 크롤링 로그와 slave 케릭 정보 추가
                let logData       = JSON.stringify(r);
                vm.query(`
                  insert into member_crawler_log
                                    set
                                      log_data        = '${logData}',
                                      mb_integrity    = '${data.sha}',
                                      mb_server       = '${r.server}',
                                      mb_class        = '${r.class}',
                                      mb_guild        = '${r.guild}',
                                      mb_nickname     = '${r.name}',
                                      mb_pvpLevel     = '${r.pvpLevel}',
                                      mb_itemLevel    = '${r.itemLevel}'
                `).then(function(result){
                  vm.query(`
                    insert into member_slave
                                      set
                                        mb_integrity  = '${data.sha}',
                                        mb_server     = '${r.server}',
                                        mb_class      = '${r.class}',
                                        mb_guild      = '${r.guild}',
                                        mb_nickname   = '${r.name}',
                                        mb_pvpLevel   = '${r.pvpLevel}',
                                        mb_itemLevel  = '${r.itemLevel}',
                                        log_no        = '${result.insertId}'
                  `);
                });
                prograssed.push(data.sha);
              }
            } // if( prograssed.indexOf(data.sha) !== -1 )
          });
        }
      });
    },

    /**
     * sha검증을 위해 회원목록 데이터를 json 형태로 가공
     */
    util__masterSha(nickname){
      return new Promise( (resolve, reject) => {
        loacwr.get_myCharecters(nickname).then(function(raw){
          let newRaw  = [];
          for (const [key, row] of Object.entries(raw.list))
          {
            newRaw.push(row.name);
          }
          let json    = JSON.stringify(newRaw);
          resolve({
            list  : raw.list,
            json  : json,
            sha   : sha256(json)
          });
        });
      });
    },

  }
};