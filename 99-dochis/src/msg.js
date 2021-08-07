const momnet        = require('momnet');

let format          ="MM/DD";

module.exports = function(config, emoji){
    let date_Next_Wed   = momnet().day(3).format(format);
    let date_Next_Thu   = momnet().day(4).format(format);
    let date_Next_Sat   = momnet().day(6).format(format);
    let date_Next_Sun   = momnet().day(7).format(format);

    return {

        /**
         * 시간 초기화
         */
        init : function(){
            date_Next_Wed   = momnet().day(3).format(format);
            date_Next_Thu   = momnet().day(4).format(format);
            date_Next_Sat   = momnet().day(6).format(format);
            date_Next_Sun   = momnet().day(7).format(format);
        },


        /**
         * 메시지 전체목록을 반환
         */
        get : function(){
            return {
                line     : this.line(),

                argos_1  : this.party1("아르고스 1팟 (시간고정)"        , "오후 9시 출발"),
                baltan_1 : this.party1("발탄하드 1팟 (시간고정)"        , "오후 9시 20분 출발 (아르고스 1팟 이후 출발)"),
                biakis_1 : this.party1("비아키스 '하드'팟 (시간고정)"   , "오후 9시 40분 출발 (발탄하드 1팟 이후 출발)"),

                argos_2  : this.argos_2(),
                baltan_2 : this.baltan_2(),
                biakis_2 : this.biakis_2(),

                end      : this.end(),
            }
        },

        /**
         * 모집시작 안내 발송
         */
        count : function( count ){
            let content;
            content     = "```\n";
            content    += `${count}초 뒤 길드 레이드 모집이 시작됩니다.`;
            content    += "```";

            return {
                content : content
            };
        },

        /**
         * 끝 라인
         */
        end : function(){
            let content;
            content     = "@everyone\n";
            content    += "```\n";
            content    += "- 끝 -";
            content    += "```";

            return {
                content : content
            };
        },

        /**
         * 모집시작 안내 발송
         */
        line : function(){
            let content;
            content     = "```cs\n";
            content    += "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
            content    += "┃ \n";
            content    += "┃ \"!! 이번주 한주도 고생많으셨습니다 !!\"\n";
            content    += "┃ \"!! 잠시 후 레이드 모집 모집이 시작됩니다. !!\"\n";
            content    += "┃ \n";
            content    += "┃ -----------------------------------\n";
            content    += "┃ \n";
            content    += "┃ \" 길드 늅늅분들을 위한 안내 \"\n";
            content    += "┃ \n";
            content    += "┃ - 우리길드는 레이드당 2개팟을 운영중입니다.\n";
            content    += "┃ - 1팟 : 매주 수요일 시간이 고정되어있습니다.\n";
            content    += "┃ - 2팟 : 시간이 고정되어있지 않고 매주 투표로 시간을 정합니다.\n";
            content    += "┃   혹시 2팟 투표시간에 원하시는 시간이 없으세요?\n";
            content    += "┃   '헛삯'에게 DM으로 문의주세욥! \n";
            content    += "┃ \n";
            content    += "┃ - 레이드 참여 대상\n";
            content    += "┃   우리 길드원의 본캐 및 부캐 모두 참여가능합니다.\n";
            content    += "┃   별도의 공격력 커트라인은 없으나, 각 레이드의 입장레벨을 확인 바랍니다.\n";
            content    += "┃   아르고스 : 1400 이상 / 발탄하드 : 1445 이상 / 비아노말 : 1430 이상 / 비아하드 : 1460 이상\n";
            content    += "┃ \n";
            content    += "┃ - 레이드 신청방법\n";
            content    += "┃   매주 일요일 오후 8시 정각에 올라오는 레이드 모집 공고에 이모티콘을 선택해주세요.\n";
            content    += "┃ \n";
            content    += "┃ -----------------------------------\n";
            content    += "┃ \n";
            content    += "┃ \" 공지사항 \" - 화요일 저녁까지 신청자가 4명 미만인 경우 모집이 취소됩니다.\n";
            content    += "┃ \n";
            content    += "┃ -----------------------------------\n";
            content    += "┃ \n";
            content    += "┃ \" 신청은 매주 선착순입니다 !! \"\n";
            content    += "┃ \n";
            content    += "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
            content    += "``` @everyone";

            return {
                content : content
            };
        },

        /**
         * 1팟 공지 자동생성
         */
        party1 : function(title, time){
            let content;
            content     = "```\n";
            content    += "[1팟] " + title + "\n";
            content    += "-------------------\n";
            content    += date_Next_Wed + " 수요일 " + time + "\n";
            content    += "참가 원하시는분은 1번을 눌러주세요!";
            content    += "\n```";

            return {
                content : content,
                emoji   : [
                    emoji.list[1]
                ]
            };
        },

        /**
         * ========== 2팟 공지 ==========
         */

        // 아르고스 2팟
        argos_2 : function(){
            let content;
            content     = "```\n";
            content    += "[2팟] 아르고스 2팟 (시간투표)\n";
            content    += "-------------------\n";
            content    += "- " + date_Next_Wed + "일 수요일 오후 08시 : 1번\n";
            content    += "- " + date_Next_Sat + "일 토요일 오후 08시 : 2번\n";
            content    += "- " + date_Next_Sun + "일 일요일 오후 08시 : 3번\n";
            content    += "- " + date_Next_Sat + "일 토요일 점심 12시 : 4번\n";
            content    += "- " + date_Next_Sun + "일 일요일 점심 12시 : 5번\n";
            content    += "-------------------\n";
            content    += "ㄴ 참여가능하신 시간을 '모두' 투표해주세요.\n";
            content    += "\n```";

            return {
                content : content,
                emoji   : [
                    emoji.list[1],
                    emoji.list[2],
                    emoji.list[3],
                    emoji.list[4],
                    emoji.list[5]
                ]
            };
        },

        // 발탄 2팟
        baltan_2 : function(){
            let content;
            content     = "```\n";
            content    += "[2팟] 발탄하드 2팟 (시간투표)\n";
            content    += "-------------------\n";
            content    += "- " + date_Next_Wed + "일 수요일 오후 08시 : 1번\n";
            content    += "- " + date_Next_Sat + "일 토요일 오후 08시 : 2번\n";
            content    += "- " + date_Next_Sun + "일 일요일 오후 08시 : 3번\n";
            content    += "- " + date_Next_Sat + "일 토요일 점심 12시 : 4번\n";
            content    += "- " + date_Next_Sun + "일 일요일 점심 12시 : 5번\n";
            content    += "** 주의 ** 아르고스 2팟과 요일이 겹칠경우 출발이 30분정도 늦어질 수 있습니다.\n";
            content    += "-------------------\n";
            content    += "ㄴ 참여가능하신 시간을 '모두' 투표해주세요.\n";
            content    += "\n```";

            return {
                content : content,
                emoji   : [
                    emoji.list[1],
                    emoji.list[2],
                    emoji.list[3],
                    emoji.list[4],
                    emoji.list[5]
                ]
            };
        },

        // 비아키스 2팟
        biakis_2 : function(){
            let content;
            content     = "```\n";
            content    += "[2팟] 비아키스 \"노말\"팟 (시간투표/트라이수준팟)\n";
            content    += "-------------------\n";
            content    += "- " + date_Next_Wed + "일 수요일 오후 09시 : 1번\n";
            content    += "- " + date_Next_Sat + "일 토요일 오후 09시 : 2번\n";
            content    += "- " + date_Next_Sun + "일 일요일 오후 09시 : 3번\n";
            content    += "- " + date_Next_Sat + "일 토요일 오후 01시 : 4번\n";
            content    += "- " + date_Next_Sun + "일 일요일 오후 01시 : 5번\n";
            content    += "-------------------\n";
            content    += "ㄴ 참여가능하신 시간을 '모두' 투표해주세요.\n";
            content    += "\n```";

            return {
                content : content,
                emoji   : [
                    emoji.list[1],
                    emoji.list[2],
                    emoji.list[3],
                    emoji.list[4],
                    emoji.list[5]
                ]
            };
        },

    }
};