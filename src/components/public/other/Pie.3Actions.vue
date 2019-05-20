<template>
  <div class="comp-pie-3actions">
    <div class="like-btn triangle-area"
         @click="onBottomAction">
      <i :class="['icon-pos-bottom', bottomIcon]"></i>
    </div>
    <div class="like-btn left-rect-area"
         @click="onLeftAction">
      <i :class="['icon-pos-left', leftIcon]"></i>
    </div>
    <div class="like-btn right-rect-area"
         @click="onRightAction">
      <i :class="['icon-pos-right', rightIcon]"></i>
    </div>
  </div>
</template>

<script>
const defaultIconClass = 'fas fa-times'
export default {
  props: {
    actions: {
      type: [Array, Object],
      default() {
        return {
          left: {
            iconClasses: defaultIconClass
          },
          right: {
            iconClasses: defaultIconClass
          },
          bottom: {
            iconClasses: defaultIconClass
          }
        }
      }
    }
  },
  computed: {
    leftIcon() {
      if (this.actions instanceof Array) {
        return this.actions[0]
      } else {
        return this.whichDeepIcon(this.actions, 'left')
      }
    },
    rightIcon() {
      if (this.actions instanceof Array) {
        return this.actions[0]
      } else {
        return this.whichDeepIcon(this.actions, 'right')
      }
    },
    bottomIcon() {
      if (this.actions instanceof Array) {
        return this.actions[0]
      } else {
        return this.whichDeepIcon(this.actions, 'bottom')
      }
    }
  },
  methods: {
    onBottomAction() {
      this.$emit('onBottomAction')
    },
    onLeftAction() {
      this.$emit('onLeftAction')
    },
    onRightAction() {
      this.$emit('onRightAction')
    },
    whichDeepIcon(source, field) {
      if (source.hasOwnProperty(field)) {
        if (typeof source[field] === 'string') {
          return source[field]
        } else {
          return source[field].iconClasses
        }
      } else {
        return defaultIconClass
      }
    }
  }
}
</script>

<style lang="less">
@import (reference) '~@/assets/css/main.less';
.comp-pie-3actions {
  position: fixed;
  display: inline-block;
  width: 120px;
  height: 120px;
  transform: translate(-50%, -50%);
  clip-path: circle(50% at 50% 50%);
  z-index: 19;

  .triangle-area,
  .left-rect-area,
  .right-rect-area {
    position: absolute;
    display: inline-block;
    color: @color-day;
    &:hover {
      background-color: #4586f3;
    }
    .fas {
      position: absolute;
      display: inline-block;
      left: 50%;
      top: 50%;
    }

    .icon-pos-bottom {
      transform: translate(-50%, -50%);
    }
    .icon-pos-left {
      transform: translate(-25%, -150%);
    }
    .icon-pos-right {
      transform: translate(-75%, -150%);
    }
  }

  .triangle-area {
    left: 0;
    bottom: -5px;
    width: 120px;
    height: 60px;
    background-color: #35aa53;
    clip-path: polygon(0 60px, 60px 0, 120px 60px, 0 60px);
  }

  .left-rect-area {
    left: -5px;
    top: 0;
    width: 60px;
    height: 120px;
    background-color: #eb4334;
    clip-path: polygon(0 0, 0 120px, 60px 60px, 60px 0, 0 0);
  }

  .right-rect-area {
    left: 65px;
    top: 0;
    width: 60px;
    height: 120px;
    background-color: #fbbd06;
    clip-path: polygon(0 0, 0 60px, 60px 120px, 60px 0, 0 0);
  }
}
</style>
