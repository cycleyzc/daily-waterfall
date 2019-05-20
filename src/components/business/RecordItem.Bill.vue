<template>
  <div class="comp-record-item">
    <p class="like-btn item-title"
       @click="onItemAction">{{item.category}}</p>
    <p class="item-detail">
      <span class="ft-s note">{{item.note}}</span>
      <span :class="[item.note ? '' : 'ft-xl']"
            v-if="item.expense">-{{item.expense | currency}}</span>
      <span :class="[item.note ? '' : 'ft-xl']"
            v-if="item.income">{{item.income | currency}}</span>
    </p>
    <span class="cut"></span>
  </div>
</template>

<script>
import { currency } from '@/filters/number.ts'
export default {
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  filters: {
    currency(value) {
      return currency(value)
    }
  },
  methods: {
    onItemAction() {
      this.$emit('onItemAction', this.item)
    }
  }
}
</script>

<style lang="less">
@import (reference) '~@/assets/css/main.less';
.comp-record-item {
  position: relative;
  display: inline-block;
  width: 160px;
  height: 100px;
  background-color: @color-night;
  margin-left: 10px;
  margin-top: 10px;
  clip-path: polygon(0 0, 160px 0, 160px 80px, 140px 100px, 0 100px, 0 0);
  // clip-path: polygon(0 0, 160px 0, 180px 20px, 180px 100px, 0 100px, 0 0);

  .item-title {
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    border-bottom: 1px solid @color-day;

    &:hover {
      text-decoration: underline;
    }
  }

  .item-detail {
    .fx-center;

    & > * {
      flex: 1;
      height: 64px;
      .fx-center;
    }

    .note {
      border-right: 1px solid @color-day;
      line-height: 1.5;
      text-align: center;
      padding: 0 10px;
      &:empty {
        display: none;
        border-right: none;
      }
    }
  }

  .cut {
    position: absolute;
    bottom: 0;
    right: 0;
    clip-path: polygon(0 0, 20px 0, 0 20px, 0 0);
    width: 20px;
    height: 20px;
    background-color: @color-night;
    z-index: 2;
    border-top: 1px solid @color-day;
    border-left: 1px solid @color-day;
  }
}
</style>
