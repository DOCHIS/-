const fetch         = require('node-fetch');
module.exports = function(config, emoji){
    var API_URL     = "https://discord.com/api/v9";
    return {

        /**
         * 모든 config를 반환
         * @returns object
         */
        getConfig : function(){
            return {
                API_URL     : API_URL,
                config      : config,
                db          : db,
                emoji       : emoji
            }
        },

        /**
         * 오늘 날짜 반환
         */
        getToday : function(){
            let date = new Date();
            let year = date.getFullYear();
            let month = ("0" + (1 + date.getMonth())).slice(-2);
            let day = ("0" + date.getDate()).slice(-2);
        
            return year + month + day;
        },

        /**
         * 이번주의 주차번호 반환
         * (월요일이 시작일)
         */
        getWeekCount : function(dowOffset){
                dowOffset   = typeof(dowOffset) == 'number' ? dowOffset : 1;
            let today       = new Date();
            let newYear     = new Date(today.getFullYear(),0,1);
            let day = newYear.getDay() - dowOffset;
                day = (day >= 0 ? day : day + 7);
            let daynum = Math.floor((today.getTime() - newYear.getTime() -
                (today.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
            let weeknum;

            if(day < 4) {
                weeknum = Math.floor((daynum+day-1)/7) + 1;
                if(weeknum > 52) {
                    let nYear = new Date(this.getFullYear() + 1,0,1);
                    let nday = nYear.getDay() - dowOffset;
                    nday = nday >= 0 ? nday : nday + 7;
                    weeknum = nday < 4 ? 1 : 53;
                }
            } else {
                weeknum = Math.floor((daynum+day-1)/7);
            }
            return weeknum;
        },

        /**
         * 투표정보 가져오기
         */
        getVote(channelId, messageId){
            return new Promise( (resolve, reject) => {
                let sql     = "select * from vote where __channelId = ? AND __messageId = ? limit 1";
                let params  = [channelId, messageId];
                db.query(sql, params, function (error, results, fields) {
                    if (error) reject(error);
                    resolve(results[0]);
                });
            });
        },

        /**
         * 리엑션 정보 가져오기
         */
        getReactions(channelId, messageId, emoji){
            return fetch(
                API_URL + '/channels/' + channelId + '/messages/' + messageId + '/reactions/' + emoji, {
                method: 'get',
                headers: {
                        "Authorization" : 'Bot ' + config.token,
                        "Content-Type"  : 'application/json'
                    }
                }).then(res => res.json());
        },

        /**
         * 리엑션 삭제하기
         */
        removeReactions(channelId, messageId, emoji, userId){
            return fetch(
                API_URL + '/channels/' + channelId + '/messages/' + messageId + '/reactions/' + emoji + "/" + userId, {
                method: 'delete',
                headers: {
                        "Authorization" : 'Bot ' + config.token,
                        "Content-Type"  : 'application/json'
                    }
                }).then(res => res.json());
        },

        /**
         * 케릭선택 데이터를 보고 투표 참여시키기
         */
         voteApply(reaction, user){
            reaction.message.delete();

            // 투표 메시지 정보
            // [0] 채널 아이디 / [1] 투표메시지 아이디
            let voteArray           = reaction.message.content.split('\n');
            let voteMsgInfo         = voteArray[voteArray.length-1].replace(/\~\~/gi, '').split("-");
            let voteSelete          = voteArray[3].split(" : ")[1];
            let voteSeleteEncode    = encodeURI(voteSelete);

            // 신청취소를 선택했는지 확인
            if(encodeURI(reaction.emoji.name) == emoji.cancel){
                this.removeReactions(voteMsgInfo[0], voteMsgInfo[1], voteSeleteEncode, user.id);
                return reaction.message.channel.send('<@' + user.id + '> 참가신청 취소!').then(msg => {
                    setTimeout(() => msg.delete(), 8000)
                });
            }

            // 참여투표에 리엑션이 있는지 체크
            let check               = false;
            this.getReactions(voteMsgInfo[0], voteMsgInfo[1], voteSeleteEncode).then(body => {
                for(key in body){
                    let row         = body[key];
                    if(row.id == user.id)
                        check = true
                }

                // 리엑션을 찾을 수 없는 경우 자동 신청 취소처리
                if( check == false){
                    this.removeReactions(voteMsgInfo[0], voteMsgInfo[1], voteSeleteEncode, user.id);
                    return reaction.message.channel.send('<@' + user.id + '> 참가신청 취소!').then(msg => {
                        setTimeout(() => msg.delete(), 8000)
                    });
                }

                // 투표 승인처리
                let msgArray    = reaction.message.content.split('\n');
                let select      = {};
                let selectCheck = false;
                let row;
                for(i=2; i<msgArray.length; i++){
                    row             = msgArray[i].split(" ");
                    if( row[0] == reaction.emoji.name){
                        select      = {
                            emoji   : row[0],
                            level   : row[1],
                            name    : row[2],
                        };
                        selectCheck =  true;
                    }
                }
    
                // // 시스템 오류
                if(selectCheck == false){
                    return reaction.message.channel.send('<@' + user.id + '> 님 선택값에 뭔가 문제가 있습니다.');
                }
    
                // // 투표정보 불러오기
                this.getVote(voteMsgInfo[0], voteMsgInfo[1]).then(function(vote) {
                    if(vote){
                        let voteData        = JSON.parse(vote.vote_data);
                        let check, sql, params;
                        for( key in voteData ){
                            check    = encodeURI(voteSelete);
    
                            if( key == check ){
                                let tmp        = select;
                                    tmp.user   = user;
                                voteData[key].push(tmp);
                                voteData        = JSON.stringify(voteData);
    
                                // update
                                params  = [
                                    voteData,
                                    voteMsgInfo[0],
                                    voteMsgInfo[1]
                                ]
                                sql     = `update
                                                    vote
                                                set 
                                                    vote_data       = ?
                                                where
                                                        __channelId = ?
                                                    AND __messageId = ?
                                                limit 1 `;
                                db.query(sql, params);
    
                                reaction.message.channel.send('<@' + user.id + '> 참가신청 완료!').then(msg => {
                                    setTimeout(() => msg.delete(), 8000)
                                })
                            }
                        }
                    } else {
                        return reaction.message.channel.send('시스템에 뭔가 오류가 발생했습니다.. 개발자에게 문의해주세요.').then(msg => {
                            setTimeout(() => msg.delete(), 10000)
                        })
                    }
                });
            });
         },

        /**
         * 투표취소
         */
        voteCancel(reaction, user){
            const channelId     = reaction.message.channel.id;
            const messageId     = reaction.message.id;
            const voteSelete    = reaction.emoji.name;

            // 투표 검색
            this.getVote(channelId, messageId).then(function(vote) {
                if(vote){
                    let voteData        = JSON.parse(vote.vote_data);
                    let tmp             = [];
                    let check, sql, params;
                    for( key in voteData ){
                        check    = encodeURI(voteSelete);

                        if( key == check ){
                            // 투표내역을 찾아서 삭제시도
                            for( key2 in voteData[key] ){
                                if(voteData[key][key2].user.id !== user.id){
                                    tmp.push(voteData[key][key2]);
                                }
                            }
                            voteData[key]       = tmp;
                            voteData        = JSON.stringify(voteData);

                            // update
                            params  = [
                                voteData,
                                channelId,
                                messageId
                            ]
                            sql     = `update
                                                vote
                                            set 
                                                vote_data       = ?
                                            where
                                                    __channelId = ?
                                                AND __messageId = ?
                                            limit 1 `;
                            db.query(sql, params);

                            reaction.message.channel.send('<@' + user.id + '> 참가신청이 취소되었습니다!').then(msg => {
                                setTimeout(() => msg.delete(), 20000)
                            })
                        }
                    }
                }
            });
        },

        /**
         * create
         */
        create : function(party, content, channelId, reactions){
            fetch(API_URL + '/channels/' + channelId + '/messages', {
                method: 'post',
                headers: {
                  "Authorization" : 'Bot ' + config.token,
                  "Content-Type"  : 'application/json'
                },
                body: JSON.stringify({content : content})
            })
            .then(res => res.json())
            .then(body => {
                
                // reaction create
                if(reactions){
                    if(Array.isArray(reactions)){
                        let sl          = 0;
                        for(key in reactions){
                            let row       = reactions[key];
                            let vm        = this;
                                sl       += 500;
                            setTimeout(function() { 
                                vm.createReaction(channelId, body.id, row);
                            }, sl);
                        }
                    } else{
                        this.createReaction(channelId, body.id, reactions);
                    }
                } // reaction create

                // 전처리
                let vote_data   = {};
                let row;
                for( key in reactions){
                    row                 = reactions[key];
                    vote_data[row]      = [];
                }

                // db insert
                let params      = [
                    party,                    // party
                    this.getWeekCount(),      // vote_round
                    content.split('\n')[1],   // vote_title
                    content,                  // vote_content
                    JSON.stringify(vote_data),// vote_data
                    JSON.stringify(body),     // __message
                    channelId,                // __channelId
                    body.id                   // __messageId
                ];
                let sql = `insert into
                                        vote
                                    set 
                                        vote_party      = ?,
                                        vote_round      = ?,
                                        vote_title      = ?,
                                        vote_content    = ?,
                                        vote_data       = ?,
                                        __message       = ?,
                                        __channelId     = ?,
                                        __messageId     = ? `;
                db.query(sql, params);
            });
        },

        /**
         * createReaction
         */
        createReaction(channelId, messageId, emoji){
            fetch(API_URL + '/channels/' + channelId + '/messages/' + messageId + '/reactions/' + emoji + '/@me', {
            method: 'put',
            headers: {
                    "Authorization" : 'Bot ' + config.token,
                    "Content-Type"  : 'application/json'
                }
            });
        },

    }
}