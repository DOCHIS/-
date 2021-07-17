const momnet        = require('momnet');

let format          ="MM/DD";
let date_Next_Wed   = momnet().day(3).format(format);
let date_Next_Thu   = momnet().day(4).format(format);
let date_Next_Sat   = momnet().day(6).format(format);
let date_Next_Sun   = momnet().day(7).format(format);

module.exports = function(config, emoji){

    return {

        /**
         * 메시지 전체목록을 반환
         */
        get : function(){
            return {
                line     : this.line(),

                argos_1  : this.party1("아르고스 1팟 (부캐가능/시간고정)"        , "오후 9시 출발"),
                baltan_1 : this.party1("발탄하드 1팟 (부캐가능/시간고정)"        , "오후 9시 20분 출발 (아르고스 1팟 이후 출발)"),
                biakis_1 : this.party1("비아키스 '하드'팟 (부캐가능/시간고정)"   , "오후 9시 40분 출발 (발탄하드 1팟 이후 출발)"),

                argos_2  : this.argos_2(),
                baltan_2 : this.baltan_2(),
                biakis_2 : this.biakis_2(),
            }
        },

        /**
         * 모집시작 안내 발송
         */
        line : function(){
            let content;
            content     = "```\n";
            content    += "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
            content    += "┃ !! 이번주 한주도 고생많으셨습니다 !!\n";
            content    += "┃ -----------------------------------\n";
            content    += "┃ - 잠시 후 레이드 모집을 시작합니다.!!\n";
            content    += "┃ - 참여를 원하시는 분은 공지에 따라 신청해주세요!!\n";
            content    += "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
            content    += "``` @everyone ";

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
            content    += date_Next_Wed + " 수요일 " + time + " 출발\n";
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
            content    += "[2팟] 아르고스 2팟 (부캐가능/시간투표)\n";
            content    += "-------------------\n";
            content    += "- " + date_Next_Wed + "일 수요일 오후 08시 : 1번\n";
            content    += "- " + date_Next_Sat + "일 토요일 오후 08시 : 2번\n";
            content    += "- " + date_Next_Sun + "일 일요일 오후 08시 : 3번\n";
            content    += "- " + date_Next_Sat + "일 토요일 점심 12시 : 4번\n";
            content    += "- " + date_Next_Sun + "일 일요일 점심 12시 : 5번\n";
            content    += "- " + date_Next_Thu + "일 오후 7~9시 사이  : 6번 (목요일)\n";
            content    += "-------------------\n";
            content    += "ㄴ 참여가능하신 시간을 '모두' 투표해주세요.\n";
            content    += "ㄴ 원하시는 시간이 없으신 경우 '로톡방'에 문의\n";
            content    += "ㄴ 투표수가 가장 많은 시간에 갑니다!\n";
            content    += "ㄴ 확정은 " + date_Next_Thu + "에 안내드리겠습니다!\n";
            content    += "\n```";

            return {
                content : content,
                emoji   : [
                    emoji.list[1],
                    emoji.list[2],
                    emoji.list[3],
                    emoji.list[4],
                    emoji.list[5],
                    emoji.list[6]
                ]
            };
        },

        // 발탄 2팟
        baltan_2 : function(){
            let content;
            content     = "```\n";
            content    += "[2팟] 발탄하드 2팟 (부캐가능/시간투표)\n";
            content    += "-------------------\n";
            content    += "- " + date_Next_Wed + "일 수요일 오후 08시 : 1번\n";
            content    += "- " + date_Next_Sat + "일 토요일 오후 08시 : 2번\n";
            content    += "- " + date_Next_Sun + "일 일요일 오후 08시 : 3번\n";
            content    += "- " + date_Next_Sat + "일 토요일 점심 12시 : 4번\n";
            content    += "- " + date_Next_Sun + "일 일요일 점심 12시 : 5번\n";
            content    += "- " + date_Next_Thu + "일 오후 7~9시 사이  : 6번 (목요일)\n";
            content    += "** 주의 ** 아르고스 2팟과 요일이 겹칠경우 출발이 30분정도 늦어질 수 있습니다.\n";
            content    += "-------------------\n";
            content    += "ㄴ 참여가능하신 시간을 '모두' 투표해주세요.\n";
            content    += "ㄴ 원하시는 시간이 없으신 경우 '로톡방'에 문의\n";
            content    += "ㄴ 투표수가 가장 많은 시간에 갑니다!\n";
            content    += "ㄴ 확정은 " + date_Next_Thu + "에 안내드리겠습니다!\n";
            content    += "\n```";

            return {
                content : content,
                emoji   : [
                    emoji.list[1],
                    emoji.list[2],
                    emoji.list[3],
                    emoji.list[4],
                    emoji.list[5],
                    emoji.list[6]
                ]
            };
        },

        // 비아키스 2팟
        biakis_2 : function(){
            let content;
            content     = "```\n";
            content    += "[2팟] 비아키스 \"노말\"팟 (부캐가능/트라이수준팟/시간투표)\n";
            content    += "-------------------\n";
            content    += "- " + date_Next_Wed + "일 수요일 오후 09시 : 1번\n";
            content    += "- " + date_Next_Sat + "일 토요일 오후 09시 : 2번\n";
            content    += "- " + date_Next_Sun + "일 일요일 오후 09시 : 3번\n";
            content    += "- " + date_Next_Sat + "일 토요일 오후 01시 : 4번\n";
            content    += "- " + date_Next_Sun + "일 일요일 오후 01시 : 5번\n";
            content    += "- " + date_Next_Thu + "일 오후 7~9시 사이  : 6번 (목요일)\n";
            content    += "- " + date_Next_Sat + "일 토요일 오후 07시 : 7번\n";
            content    += "- " + date_Next_Sun + "일 일요일 오후 07시 : 8번\n";
            content    += "-------------------\n";
            content    += "ㄴ 참여가능하신 시간을 '모두' 투표해주세요.\n";
            content    += "ㄴ 원하시는 시간이 없으신 경우 '로톡방'에 문의\n";
            content    += "ㄴ 투표수가 가장 많은 시간에 갑니다!\n";
            content    += "ㄴ 확정은 " + date_Next_Thu + "에 안내드리겠습니다!\n";
            content    += "\n```";

            return {
                content : content,
                emoji   : [
                    emoji.list[1],
                    emoji.list[2],
                    emoji.list[3],
                    emoji.list[4],
                    emoji.list[5],
                    emoji.list[6],
                    emoji.list[7],
                    emoji.list[8]
                ]
            };
        },

    }
};