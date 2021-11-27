const axios         = require('axios');
const cheerio       = require('cheerio');

module.exports = function (config, emoji) {
  return {

    /**
     * 슬래시 추가
     */
     addslashes(string) {
        return string.replace(/\\/g, '\\\\').
            replace(/\u0008/g, '\\b').
            replace(/\t/g, '\\t').
            replace(/\n/g, '\\n').
            replace(/\f/g, '\\f').
            replace(/\r/g, '\\r').
            replace(/'/g, '\\\'').
            replace(/"/g, '\\"');
    },
    
    /**
     * search
     */
    search(keyword){
      vm      = this;
      return new Promise((resolve, reject) => {
        axios.get('https://www.inven.co.kr/search/lostark/article/' + encodeURI(keyword) + "?sort=recency").then((response)=>{
          const $       = cheerio.load(response.data);
          const find    = $(".section_body").find(".item");
          const list    = [];

          find.each(function (index, elem) {
            let obj     = find.eq(index);
            list.push({
              title       : vm.addslashes(obj.find('h1').text().trim()),
              content     : vm.addslashes(obj.find(".caption").text().trim()),
              boardName   : vm.addslashes(obj.find(".board").text().trim()),
              date        : vm.addslashes(obj.find(".date").text().trim()),
              link        : vm.addslashes(obj.find(".name").attr("href")),
            });
          });

          resolve(list);
        });
      });
    }

  }
};