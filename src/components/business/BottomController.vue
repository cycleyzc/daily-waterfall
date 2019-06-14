<template>
  <div class="view-bottom-controller">
    <i class="fas fa-yen-sign btn-center"
       v-show="show.mainIcon"></i>
    <i class="fas fa-chart-line like-btn btn-center"
       v-show="show.chartIcon"
       @click="toggleRoute('record')"></i>
    <i class="fas fa-info like-btn btn-center"
       v-show="show.recordIcon"
       @click="toggleRoute('chart')"></i>
    <div :class="['fl','info-container', show.bookInfo ? 'fx-start' : '']">
      <div>
        <i class="fas fa-wallet book-cover"
           v-if="show.bookInfo && !book.img"></i>
        <img src="http://imgup01.zb8.com/zb8/2018-03/25/17/15219700321896_0.png"
             class="book-cover"
             alt=""
             v-if="show.bookInfo && book.img">
        <div class="book-container"
             v-if="show.bookInfo">
          <span class="ft-xl single-ellipsis book-name">{{book.name}}</span>
          <span class="color-diabled single-ellipsis book-type">{{book.type}}</span>
        </div>
      </div>
      <i class="fas fa-swatchbook like-btn feature-icon icon-book-list"
         @click="onBookListAction"></i>
    </div>

    <div class="fr feature-container">
      <!-- <i class="fas fa-plus like-btn feature-icon icon-add-book"></i> -->
      <!-- <i class="fas fa-plus-circle like-btn feature-icon icon-add-book"></i> -->
      <i class="fas fa-plus-square like-btn feature-icon icon-add"
         @click="onIconAddAction"></i>
      <i class="fas fa-filter like-btn feature-icon icon-filter"
         @click="onIconFilterAction"></i>
      <i class="fas fa-sync like-btn feature-icon icon-sync"
         @click="onIconSyncAction"></i>
      <!-- <i class="fas fa-edit like-btn feature-icon icon-add-book"></i> -->
      <!-- <i class="fas fa-pen-square like-btn feature-icon icon-edit"></i> -->
      <!-- <i class="fas fa-pencil-alt like-btn feature-icon icon-add-book"></i> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 账本信息
    book: {
      type: Object,
      default() {
        return {}
      }
    },
    // 显隐性对象
    show: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  components: {
  },
  methods: {
    toggleRoute(type) {
      this.$emit('onToggleRoute', type)
    },
    onBookListAction() {
      this.$emit('onBookListAction')
    },
    onIconAddAction() {
      this.$emit('onIconAddAction')
    },
    onIconFilterAction() {
      this.$emit('onIconFilterAction')
    },
    onIconSyncAction() {
      this.$emit('onIconSyncAction')
    }
  }
}
</script>

<style lang="less">
@import (reference) '~@/assets/css/main.less';
@import '~@/assets/css/business/bottomComtroller.less';
.view-bottom-controller {
  position: relative;
  width: 100%;
  height: @controller-height;
  border-top: 1px solid @color-night;
  border-left: 1px solid @color-night;
  border-right: 1px solid @color-night;
  border-bottom: 1px solid @color-night;
  overflow: hidden;

  .feature-icon {
    width: @controller-height / 2;
    height: @controller-height;
    font-size: 24px;
    margin-right: 10px;
    color: @color-day;
    .fx-center;
  }

  .fx-start {
    justify-content: flex-start !important;
  }

  .info-container {
    width: 480px;
    height: @controller-height;
    .fx-center;

    .book-cover {
      float: left;
      width: 90px;
      height: @controller-height;
      color: @color-night;
      font-size: 48px;
      background-color: @color-day;
      margin-right: 20px;
      .fx-center;
    }

    .book-container {
      float: left;
      height: @controller-height;
      width: 200px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      color: @color-day;
      & > * {
        flex: 1;
        width: 100%;
        display: flex;
        align-items: center;
      }

      .book-type {
        margin-top: -10px;
      }
    }

    .icon-book-list {
      float: left;
    }
  }

  .feature-container {
    width: 480px;
    height: @controller-height;
    .fx-center;
  }

  .btn-center {
    position: absolute;
    width: 60px;
    height: 60px;
    text-align: center;
    border: 2px solid @color-day;
    border-radius: 30px;
    font-size: 36px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: @color-day;
    .fx-center;
  }
}
</style>
