const axios = require('axios');
const cheerio = require('cheerio');

module.exports = function (config, emoji) {
  var ROA_URL = "https://m-lostark.game.onstove.com";
  return {

    /**
     * 프로필 정보를 얻은 뒤 return
     */
    get_charecter(nick) {
      return new Promise((resolve, reject) => {
        axios.get(`${ROA_URL}/Profile/Character/` + encodeURI(nick), {})
          .then(response => {

            // 보유 케릭정보 뽑기
            const $ = cheerio.load(response.data);
            const list = $(".myinfo__character--wrapper2").find('li');
            const tmp = [];
            list.each(function (index, elem) {
              let obj = list.eq(index);
              let level = obj.find('span').text().trim();
              let name = obj.text().replace(level, '').trim();
              tmp.push({
                level: level,
                name: name
              });
            });

            // 기본데이터 반환
            const data = {
              memberNo  : response.data.match(/(var \_memberNo \= \'*.+'?)/g),
              pcId      : response.data.match(/(var \_pcId \= \'*.+'?)/g),
              worldNo   : response.data.match(/(var \_worldNo \= \'*.+'?)/g),
              pcName    : response.data.match(/(var \_pcName \= \'*.+'?)/g),
              pvpLevel  : response.data.match(/(var \_pvpLevel \= \'*.+'?)/g),
            }
            for (const [key, value] of Object.entries(data)) {
              if(value)
                data[key] = value[0].split("'")[1];
              else 
                return resolve(data);
            }

            // 추가 데이터 넣기
            let addData     = {
              itemLevel     : parseInt(
                                $(".myinfo__contents-level")
                                  .find(".wrapper-define")
                                  .eq(1)
                                  .find(".level")
                                  .eq(0)
                                  .html()
                                  .replace(/(<([^>]+)>)/gi, "")
                                  .replace(",", "")
                              ),
              server        : $(".wrapper-define").eq(0).find("dd").eq(0).text().replace('@',''),
              class         : $(".wrapper-define").eq(0).find("dd").eq(1).text(),
              guild         : $(".guild-name").text(),
              list          : tmp,
            };
            for (const [key, value] of Object.entries(addData)) {
              data[key] = value;
            }

            resolve(data);
          })
          .catch(function (error) {
            console.log("!! error", error);
            reject(error);
          });
      }); // Promise
    },

    /**
     * 내 보유 케릭터 목록 추출
     */
    get_myCharecters(nick) {
      let vm = this;

      return new Promise((resolve, reject) => {

        vm.get_charecter(nick).catch(err => { reject(err); })
          .then(function (data) {
            if(data.memberNo === null)
              return resolve(false);

            // 내부 로직용 loop 함수
            function __inLoop(list, index) {
              return new Promise((resolve, reject) => {
                vm.get_charecter(list.list[index].name).catch(err => { reject(err); })
                  .then(function (data) {
                    let n = data;
                    list.list[index] = { ...list.list[index], ...n };

                    index++;
                    if (typeof list.list[index] == 'undefined')
                      return resolve(list);

                    return resolve(__inLoop(list, index));
                  });
              });
            }

            // 케릭별 레벨정보를 얻기위한 2차 크롤링
            let index = 0;
            __inLoop(data, index).then(function (data) {

              // 아이템 레벨 높은 순것 우선 출력
              data.list.sort(function (a, b) {
                return b.itemLevel - a.itemLevel;
              });

              resolve(data);
            });
          });
        // resolve(data);
      }); // Promise
    },
  }
};