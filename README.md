# 따봉도치야 고마워!

언제나 당신에게 행운을 가져다주었던 따봉도치!  
이제 로스트아크를 위한 디스코드 봇으로만나보세요!  
따봉도치가 여러분들의 로생에 행운을 가져다줄꺼에요!

- ** 따봉도치봇 프로젝트는 오픈소스 프로젝트로 개발되었습니다. **
- ** 따봉도치봇은 마이크로 서비스 아키텍쳐 구현을 위해 프로젝트를 가능한 작게 쪼개서 제작되었습니다. **

---

## 주요기능 소개
- 따봉도치봇에 대한 소개는 공식 사이트 소개페이지를 참고해주세요!
    - 공식 사이트 : https://ttabong.dochis.net/

---

## 1. 디렉토리 구성 및 주요스택 소개
### 00. officialSite
- 소개 : 따봉도치봇의 공식사이트입니다.
    - 따봉도치봇을 소개하는 페이지가 구성되어있습니다.
    - dicord의 OAuth 2.0 인증을 위한 API가 구성되어있습니다.
    - OAuth 인증을 통해 토큰정보를 얻고 이를 AWS Dynamo DB에 저장하는 역할을 수행합니다.
    - 또한 토큰정보가 만료되지 않도록 Cron을 통해 토큰을 자동 리프레시하는 역할을 수행합니다.
- 기술스택 : Nuxt.js, Vue.js, typescript, Express.js
- 라이브러리 :
    - MVC 패턴라이브러리 [nuxt/todomvc](https://github.com/nuxt/todomvc)
    - 디자인 라이브러리 [free-tailwindcss-html-5-website-template-pavo](https://themewagon.com/themes/free-tailwindcss-html-5-website-template-pavo/)
    - 기타 : aws-sdk / buffer / node-cron

### 10. eventLisner
- 소개 : dicord.js와 sockect 통신을 통해 사용자들의 채팅내역을 수집하여 AWS SQS에  적재합니다.
- 기술스택 : node.js, discord.js
- 기타 : aws-sdk

### 20-messageSender
- 소개 : AWS SQS에 적재된 메시지를 수신하여 사용자들에게 메시지를 응답합니다.
- 기술스택 : ~ 개발중 ~