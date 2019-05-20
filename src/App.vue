<template>
  <div id="app">
    <router-view class="content" />
  </div>
</template>

<script>
export default {

}
</script>


<style lang="less">
@import './assets/css/main.less';
#app {
  width: 100vw;
  height: 100vh;
  background-color: @color-soft;
}
// .content {
//   position: fixed;
//   top: 50%;
//   left: 50%;
//   display: block;
//   width: @content-width;
//   height: @content-height;
//   background-color: @color-day;
//   transform: translate(-50%, -50%);
// }
</style>
