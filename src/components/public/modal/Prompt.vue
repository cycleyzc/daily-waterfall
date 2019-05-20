<template>
  <div class="comp-prompt">
    <p class="ft-l prompt-title">{{title}}</p>
    <div class="prompt-input">
      <input type="text"
             :class="['ft-l', isError ? 'bd-error': '']"
             :placeholder="placeholder"
             v-model="content">
    </div>
    <slot name="plugin"></slot>
    <div class="prompt-action">
      <i class="like-btn fas fa-check-circle"
         @click="confirm"></i>
      <i class="like-btn fas fa-times-circle"
         @click="cancel"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: [String],
      default() {
        return '请输入'
      }
    },
    placeholder: {
      type: [String],
      default() {
        return '请输入内容'
      }
    },
    isError: {
      type: [Boolean],
      default() {
        return false
      }
    }
  },
  data() {
    return {
      content: ''
    }
  },
  methods: {
    confirm() {
      this.$emit('onPromptConfirm', this.content)
    },
    cancel() {
      this.$emit('onPromptCancel')
    }
  }
}
</script>

<style lang="less">
@import (reference) './../../../assets/css/main.less';
.comp-prompt {
  position: absolute;
  display: flex;
  align-items: center;
  flex-direction: column;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  // height: 140px;
  background-color: @color-day;
  border-radius: 10px;
  color: @color-night;
  padding: 20px;

  & > * {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .prompt-title {
    margin-bottom: 10px;
  }

  .prompt-input,
  .prompt-action {
    height: 40px;
  }

  .prompt-input {
    margin-bottom: 10px;
    input {
      width: 100%;
      height: 100%;
      border: none;
      text-align: center;
    }
  }

  .prompt-action {
    & > * {
      flex: 1;
      font-size: 28px;
      text-align: center;
      line-height: 1;
    }
    .fx-center;
  }
}
</style>
