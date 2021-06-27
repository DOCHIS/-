<template>
  <div>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap" rel="stylesheet">

    <!-- Navigation -->
    <nav class="navbar fixed-top">
      <div class="container sm:px-4 lg:px-8 flex flex-wrap items-center justify-between lg:flex-nowrap">
        <a class="inline-block mr-4 py-0.5 text-xl whitespace-nowrap hover:no-underline focus:no-underline" href="/">
          <img src="~/assets/images/logo.svg" alt="alternative" class="h-8">
        </a>

        <button class="background-transparent rounded text-xl leading-none hover:no-underline focus:no-underline lg:hidden lg:text-gray-400" type="button" data-toggle="offcanvas">
          <span class="navbar-toggler-icon inline-block w-8 h-8 align-middle"></span>
        </button>

        <div id="navbarsExampleDefault" class="navbar-collapse offcanvas-collapse lg:flex lg:flex-grow lg:items-center">
          <ul class="pl-0 mt-3 mb-2 ml-auto flex flex-col list-none lg:mt-0 lg:mb-0 lg:flex-row">
            <li>
              <a class="nav-link page-scroll active" href="/#header">홈 <span class="sr-only">(현재)</span></a>
            </li>
            <li>
              <a class="nav-link page-scroll" href="/#details">기능</a>
            </li>
            <li>
              <a class="nav-link page-scroll" href="/#private">개인정보처리방침</a>
            </li>
            <li>
              <a class="nav-link page-scroll invite-cti" href="/#download">디스코드에 초대</a>
            </li>
          </ul>
        </div> <!-- end of navbar-collapse -->
      </div> <!-- end of container -->
    </nav> <!-- end of navbar -->
    <!-- end of navigation -->

    <Nuxt />
    <script src="~/assets/js/jquery.min.js"></script> <!-- jQuery for JavaScript plugins -->
    <script src="~/assets/js/jquery.easing.min.js"></script> <!-- jQuery Easing for smooth scrolling between anchors -->
    <script src="~/assets/js/swiper.min.js"></script> <!-- Swiper for image and text sliders -->
    <script src="~/assets/js/jquery.magnific-popup.js"></script> <!-- Magnific Popup for lightboxes -->
    <script src="~/assets/js/scripts.js"></script> <!-- Custom scripts -->
  </div>
</template>

<style>
body, html {font-family: 'Noto Sans KR', sans-serif;}
</style>
