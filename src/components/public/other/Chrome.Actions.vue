<template>
  <div class="comp-chrome">
    <div class="like-btn block-center"
         @click="onCenterAction">
      <i :class="['icon', 'fas', 'fa-times']"></i>
    </div>
    <div class="like-btn block-top"
         @click="onTopAction">
      <i :class="['icon', topIcon]"></i>
    </div>
    <div class="like-btn block-left"
         @click="onLeftAction">
      <i :class="['icon', leftIcon]"></i>
    </div>
    <div class="like-btn block-right"
         @click="onRightAction">
      <i :class="['icon', rightIcon]"></i>
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
          top: {
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
    topIcon() {
      if (this.actions instanceof Array) {
        return this.actions[0]
      } else {
        return this.whichDeepIcon(this.actions, 'top')
      }
    }
  },
  methods: {
    onCenterAction() {
      this.$emit('onCenterAction')
    },
    onTopAction() {
      this.$emit('onTopAction')
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
@chrome-length: 100px;
@half-len: @chrome-length / 2;
@short-len: @chrome-length * 3 / 10;
@long-len: @chrome-length * 7 / 10;
@center-circle-r: 45px;
@center-circle-bd: 5px;
@color-center: #4586f3;
@color-top: #eb4334;
@color-left: #35aa53;
@color-right: #fbbd06;
.comp-chrome {
  position: fixed;
  display: inline-block;
  width: @chrome-length;
  height: @chrome-length;
  background-color: #fff;
  z-index: 19;
  transform: translate(-50%, -50%);
  clip-path: circle();

  .block-center {
    position: absolute;
    display: inline-block;
    width: @center-circle-r;
    height: @center-circle-r;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: @center-circle-bd solid @color-day;
    background-color: @color-center;
    z-index: 3;
    border-radius: 50%;
    .fx-center;

    &:hover {
      background-color: @color-day;
    }

    .icon {
      color: @color-center;
    }
  }

  .block-top {
    position: absolute;
    display: inline-block;
    width: @chrome-length;
    height: @chrome-length;
    background-color: @color-top;
    top: 0;
    left: 0;
    z-index: 2;
    clip-path: polygon(
      0 0,
      @chrome-length 0,
      @chrome-length @short-len,
      @half-len @short-len,
      @short-len @half-len,
      0 0
    );
    &:hover {
      background-color: @color-day;
    }
    .icon {
      position: absolute;
      color: @color-top;
      transform: translate(-50%, -50%);
      left: 50px;
      top: 15px;
    }
  }

  .block-left {
    position: absolute;
    display: inline-block;
    width: @chrome-length;
    height: @chrome-length;
    background-color: @color-left;
    top: 0;
    left: 0;
    z-index: 2;
    clip-path: polygon(
      0 0,
      0 @chrome-length,
      @short-len @chrome-length,
      @half-len @long-len,
      @short-len @half-len,
      0 0
    );
    &:hover {
      background-color: @color-day;
    }
    .icon {
      position: absolute;
      color: @color-left;
      left: 16px;
      top: 60px;
      transform: translate(-50%, -50%);
    }
  }

  .block-right {
    position: absolute;
    display: inline-block;
    width: @chrome-length;
    height: @chrome-length;
    background-color: @color-right;
    top: 0;
    left: 0;
    z-index: 2;
    clip-path: polygon(
      @chrome-length @chrome-length,
      @short-len @chrome-length,
      @half-len @long-len,
      @long-len @half-len,
      @half-len @short-len,
      @chrome-length @short-len,
      @chrome-length @chrome-length
    );
    &:hover {
      background-color: @color-day;
    }

    .icon {
      position: absolute;
      color: @color-right;
      transform: translate(-50%, -50%);
      left: 78px;
      top: 70px;
    }
  }
}
</style>
