<template>
  <div class="comp-mask-normal">
    <slot name="slot"></slot>
  </div>
</template>

<script>
export default {
  methods: {
  }
}
</script>

<style lang="less">
@import (reference) './../../../assets/css/main.less';
.comp-mask-normal {
  position: fixed;
  z-index: 99;
  width: @content-width;
  height: @content-height;
  background-color: rgba(0, 0, 0, 0.6);
}
</style>
