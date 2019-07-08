<template>
  <div id="app">
    <div class="condition-title"
         v-if="title">
      <span class="ft-xl">{{title}}</span>
    </div>
    <router-view class="content"
                 @onChangeTitle="_changeTitle" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: `${new Date().getFullYear()}年${new Date().getMonth() + 1}月`
    }
  },
  methods: {
    _changeTitle(title) {
      this.title = title
    }
  }
}
</script>

<style src="izitoast/dist/css/iziToast.css"></style>
<style src="element-ui/lib/theme-chalk/index.css"></style>

<style lang="less">
@import './assets/css/main.less';
#app {
  width: 100vw;
  height: 100vh;
  background-color: @color-soft;
}

.condition-title {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translate(-50%, 0);
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    color: @color-night;
    // padding: 10px 40px;
    // border: 1px solid @color-night;
  }
}
</style>
