<template>
  <div>
    <!-- Header -->
    <header class="ex-header bg-gray">
      <div class="container mx-auto px-4 sm:px-8 xl:max-w-6xl xl:px-4">
        <h1 class="xl:ml-24" style="font-size:2rem; font-weight:bold">
          설치중 오류가 발생하였습니다.
        </h1>
        <h2>
            Error Title : {{$route.query.error}}
        </h2>
        <p>
            Error Description : {{$route.query.error_description}}
        </p>
      </div> <!-- end of container -->
    </header> <!-- end of ex-header -->
    <!-- end of header -->
  </div>
</template>

<script>
</script>

<style scoped>
</style>
