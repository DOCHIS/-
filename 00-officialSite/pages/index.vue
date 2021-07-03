<template>
  <div>
    <!-- Header -->
    <header id="header" class="header py-28 text-center md:pt-36 lg:text-left xl:pt-44 xl:pb-32">
      <div class="container px-4 sm:px-8 lg:grid lg:grid-cols-2 lg:gap-x-8">
        <div class="mb-16 lg:mt-32 xl:mt-40 xl:mr-12">
          <h1 class="h1-large mb-5">
            따봉도치야 고마워!
          </h1>
          <p class="p-large mb-8">
            언제나 당신에게 행운을 가져다주었던 따봉도치!<br>
            이제 로스트아크를 위한 디스코드 봇으로만나보세요!<br>
            따봉도치가 여러분들의 로생에 행운을 가져다줄꺼에요!
          </p>
          <a class="btn-solid-lg" @click="invite()">
            <i class="fab fa-discord">-</i>
            디스코드에 초대하기
          </a>
        </div>
        <div class="xl:text-right">
          <img class="inline" src="~/assets/images/header-smartphone.png" alt="초대하기">
        </div>
      </div> <!-- end of container -->
    </header> <!-- end of header -->
    <!-- end of header -->

    <!-- Details 1 -->
    <div id="details" class="pt-12 pb-16 lg:pt-16">
      <div class="container px-4 sm:px-8 lg:grid lg:grid-cols-12 lg:gap-x-12">
        <div class="lg:col-span-5">
          <div class="mb-16 lg:mb-0 xl:mt-16">
            <h2 class="mb-6">
              로스트아크의 다양한 수집물의 수집현황을 확인해보세요!
            </h2>
            <p class="mb-4">
              수집물 수집현황을 이제 명령어만으로 편하게 확인하세요!
            </p>
            <p class="mb-4">
              <storng class="inline-strong" style="display:block">
                <i class="fas fa-chevron-right color-primary">-</i>
                지원되는 명령어
              </storng>
              !섬마, !오페별, !거심, !미술품,<br>
              !모코코, !모험물, !징표, !세계수
            </p>
          </div>
        </div> <!-- end of col -->
        <div class="lg:col-span-7">
          <div class="xl:ml-14">
            <img class="inline" src="~/assets/images/details-1.png" alt="명령어 종류">
          </div>
        </div> <!-- end of col -->
      </div> <!-- end of container -->
    </div>
    <!-- end of details 1 -->

    <!-- Details 2 -->
    <div class="py-24">
      <div class="container px-4 sm:px-8 lg:grid lg:grid-cols-12 lg:gap-x-12">
        <div class="lg:col-span-7">
          <div class="mb-12 lg:mb-0 xl:mr-14">
            <img class="inline" src="~/assets/images/details-2.png" alt="인게임 아이콘">
          </div>
        </div> <!-- end of col -->
        <div class="lg:col-span-5">
          <div class="xl:mt-12">
            <h2 class="mb-6">
              로스트아크 인게임 이모티콘을 이제 디스코드에서도!!
            </h2>
            <p class="mb-4">
              게임 내에서 사용하던 이모티콘을 디스코드에서도 사용하고 싶으신가요??  채팅중 원하는 이모티콘을 괄호로 묶어서 입력해보세요! 따봉도치봇이 이모티콘을 올려줄꺼에요!
            </p>
            <p class="mb-4">
              <storng class="inline-strong" style="display:block">
                <i class="fas fa-chevron-right color-primary">-</i>
                지원되는 이모티콘
              </storng>
              [놀자에요], [머쓱해요], [뭐라구요], [사랑해], [웃기구요], [웃프네요], [정말이요], [추천이요], [화가나요], [화이팅]
            </p>
          </div>
        </div> <!-- end of col -->
      </div> <!-- end of container -->
    </div>
    <!-- end of details 2 -->

    <!-- Details 3 -->
    <div id="private" class="pt-16 pb-14">
      <div class="container px-4 sm:px-8 lg:grid lg:grid-cols-12 lg:gap-x-12">
        <div class="lg:col-span-5">
          <div class="mb-16 lg:mb-0 xl:mt-16">
            <h2 class="mb-6">
              개인정보를 어떻게 수집하고 폐기하는지 투명하게 안내하고 안전하게 관리하겠습니다
            </h2>
            <p class="mb-4">
              따봉도치봇은 채팅메시지를 분석하고 그에 따른 로봇 서비스 제공을 위해 채널의 채팅내역을 수집하고 목적을 달성한 이후에는 폐기합니다
            </p>
            <p class="mb-4">
              따봉도치봇이 수집하는 정보를 어떻게 처리하는지에 대한 자세한 설명은 아래 링크를 참고해주세요!
            </p>
            <a class="btn-solid-reg popup-with-move-anim mr-1.5" href="/private">
              어려운말 없이 적어본 개인정보처리방침!
            </a>
          </div>
        </div> <!-- end of col -->
        <div class="lg:col-span-7">
          <div class="ml-14">
            <img class="inline" src="~/assets/images/details-3.png" alt="개인정보 보호">
          </div>
        </div> <!-- end of col -->
      </div> <!-- end of container -->
    </div>
    <!-- end of details 3 -->

    <!-- Conclusion -->
    <div id="download" class="basic-5 mt-14">
      <div class="container px-4 sm:px-8 lg:grid lg:grid-cols-2">
        <div class="mb-16 lg:mb-0">
          <img src="~/assets/images/conclusion-smartphone.png" alt="따봉도치봇 초대하기">
        </div>
        <div class="lg:mt-24 xl:mt-44 xl:ml-12">
          <h2 class="mb-9 text-gray-800 text-3xl leading-10">
            이제 따봉도치봇을<br>
            디스코드 채널에<br>
            초대해볼까요??
          </h2>
          <a class="btn-solid-lg" href="#" @click="invite()">
            <i class="fab fa-discord">-</i>
            디스코드에 초대하기
          </a>
        </div>
      </div> <!-- end of container -->
    </div> <!-- end of basic-5 -->
    <!-- end of conclusion -->

    <!-- Footer -->
    <div class="footer">
      <div class="container px-4 pb-14 sm:px-8">
        <h4 class="mb-8 lg:max-w-3xl lg:mx-auto">
          따봉도치봇에 추가되었으면 하는 기능이나 사용중 불편사항이 있으신가요??
          디스코드 채널에서 이야기해주세요!
          <a class="text-indigo-600 hover:text-gray-500" href="https://discord.gg/HgzAUdJKwR" target="_blank">
            https://discord.gg/HgzAUdJKwR
          </a>
        </h4>
      </div> <!-- end of container -->
    </div> <!-- end of footer -->
    <!-- end of footer -->
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    invite () {
      const state = btoa(navigator.userAgent.toLowerCase())
      const protocol = process.env.NODE_ENV === 'production' ? 'https://' : 'http://'
      const redirect = protocol + location.host + '/api/invite'
      const clientId = process.env.NODE_ENV === 'production' ? '849877757889740841' : '851029792391299083'
      let url = 'https://discord.com/api/oauth2/authorize?client_id=' + clientId
      url += '&permissions=8'
      url += '&scope=identify%20connections%20guilds%20bot%20messages.read%20applications.commands'
      url += '&response_type=code'
      url += '&state=' + state
      url += '&redirect_uri=' + encodeURIComponent(redirect)
      console.log('>> redirect : ' + url)
      location.href = url
    }
  }
}
</script>

<style scoped>
</style>
