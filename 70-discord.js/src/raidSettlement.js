const config = require('../../config.json');
const mysql = require('mysql');
const calculator = require('./raidSettlementCalculator.js');

// lib
module.exports = function (client) {
  return {

    /**
     * index
     */
    index(nickname) {
      this.findNickname(nickname).then((data) => {
        // not found
        if (data.length == 0)
          console.log("not found");

        this.getCharacterList(data[0].mb_integrity).then((list) => {
          let controller = new calculator();
          let data = controller.init(list).get();
          console.log(data);
        })
      });
    },


    /**
    * query
    */
    query(sql) {
      return new Promise((resolve, reject) => {
        console.log(">> [001] | sql(1) : ", sql);
        let connection = mysql.createConnection({
          host: config.mysql_host,
          user: config.mysql_user,
          password: config.mysql_password,
          database: config.mysql_database
        });

        connection.connect();
        connection.query(sql, function (err, rows) {
          if (err) reject(err);
          resolve(rows);

          connection.end();
        });

      })
    },

    /**
     * 특정 닉네임이 db에 있는지 검색
     */
    findNickname(nickname) {
      return new Promise((resolve, reject) => {
        let sql = `select * from member_slave where mb_server = '아만' AND mb_nickname = '${nickname}' limit 1`;
        this.query(sql).then((rows, error) => {
          if (error) reject(error)
          resolve(rows);
        });
      });
    },

    /**
     * 특정 닉네임에 대한 부캐릭 db를 모두 뽑기
     */
    getCharacterList(integrity) {
      return new Promise((resolve, reject) => {
        let sql = `select * from member_slave where mb_server = '아만' AND mb_integrity = '${integrity}'`;
        this.query(sql).then((rows, error) => {
          if (error) reject(error)
          resolve(rows);
        });
      });
    },
  }
}