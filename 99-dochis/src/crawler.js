const axios    = require('axios');
const cheerio  = require('cheerio');

module.exports = function(config, emoji){
    var ROA_URL     = "https://m-lostark.game.onstove.com";
    return {

        /**
         * 회원 정보를 크롤링
         */
        crawlerId(nickname){
            return axios.get(ROA_URL + "/Profile/Character/" + encodeURI(nickname), {})
        },

        /**
         * 회원정보 가져오기
         */
        getId(nickname){
            return new Promise( (resolve, reject) => {
                this.crawlerId(nickname)
                .then(function(response) {
                    // 보유 케릭정보 뽑기
                    const $         = cheerio.load(response.data);
                    const list      = $(".myinfo__character--wrapper2").find('li');
                    const tmp       = [];
                    list.each(function (index, elem) {
                        let obj     = list.eq(index);
                        let level   = obj.find('span').text().trim();
                        let name    = obj.text().replace(level, '').trim();
                        tmp.push({
                            level       : level,
                            name        : name
                        });
                    });
                    
                    if(list.length == 0){
                        reject("list 0");
                    }

                    
                    // 기본데이터 반환
                    const data      = {
                        memberNo    : response.data.match(/(var \_memberNo \= \'*.+'?)/g),
                        pcId        : response.data.match(/(var \_pcId \= \'*.+'?)/g),
                        worldNo     : response.data.match(/(var \_worldNo \= \'*.+'?)/g),
                        pcName      : response.data.match(/(var \_pcName \= \'*.+'?)/g),
                        pvpLevel    : response.data.match(/(var \_pvpLevel \= \'*.+'?)/g),
                    }
                    for (const [key, value] of Object.entries(data)) {
                        data[key]   = value[0].split("'")[1];
                    }
                    data.list       = tmp;

                    resolve(data);
                })
                .catch(function (error) {
                    reject(error);
                });
            });
        },

        /**
         * 케릭터 목록중 선택할 수 있는 메시지 전송
         */
         getCharacterPicker(reaction, user){

            // 회원정보 불러오기
            this.getId( user.username ) 
            .catch(err => {
                reaction.message
                        .channel
                        .send(`<@${user.id}> 님 '${user.username}'로 검색된 로아 케릭터가 없습니다. 디스코드 닉네임과 로아 케릭터 이름을 똑같이 맞춰주세요. (이 메시지는 60초뒤 삭제됩니다.)`)
                        .then(msg => {
                            reaction.users.remove(user.id);
                            setTimeout(() => msg.delete(), 5000)
                        });
            })
            .then(function(data) {
                let msg     = `[선택해주세요]\n`;
                    msg    += `<@${user.id}> 님 어떤 캐릭터로 참여하실껀가요?\n`;
                    msg    += `투표명 : ${reaction.message.content.split('\n')[1]}\n`;
                    msg    += `선택값 : ${reaction.emoji.name}\n`;
                    msg    += `--------------------------------------`;
                    msg    += "\n❌ : 신청취소"

                let i       = 1;
                let ejs     = [
                    emoji.cancel
                ];
                let ej, row;
                for( key in data.list){
                    ej       = decodeURI(emoji.list[i]);
                    row      = data.list[key];
                    msg     += `\n${ej} ${row.level} ${row.name}`
                    
                    ejs.push(ej);
                    i++;
                }

                msg    += `\n--------------------------------------\n`;
                msg    += "아래 숫자는 따봉도치봇이 사용하는 숫자입니다.\n"
                msg    += `~~${reaction.message.channel.id}-${reaction.message.id}~~`;

                // 메시지 전송
                reaction.message
                        .channel
                        .send(msg)
                        .then(msg => {
                            for(key in ejs){
                                let row       = ejs[key];
                                msg.react(row);
                            }
                        });
            });
            
            // let queryString = {
            //     memberNo    : profile.memberNo,
            //     worldNo     : profile.worldNo,
            //     pcId        : profile.pcId,
            //   };
            // queryString     = convert_queryString(queryString);
        },

    }
};