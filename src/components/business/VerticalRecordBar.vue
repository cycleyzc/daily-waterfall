<template>
  <div class="comp-vertical-record-bar">
    <h3 :class="['bg-week-odd', 'like-btn']"
        @click.stop.self="toggleContent">{{data.date}}</h3>
    <div class="summary-container"
         v-if="!showDetail">
      <div>
        <div class="income-container">
          <p class="ft-xl">收入</p>
          <p class="ft-xxl">{{data.income | currency}}</p>
        </div>
      </div>
      <div>
        <div class="expense-container">
          <p class="ft-xl">支出</p>
          <p class="ft-xxl">{{data.expense | currency}}</p>
        </div>
      </div>
    </div>
    <div class="inner-container"
         v-if="showDetail">
      <div :class="['detail-list']">
        <Item-bill :item="v"
                   v-for="(v, i) in data.data"
                   :key="i"
                   @onItemAction="_onItemAction"></Item-bill>
      </div>
    </div>
    <!-- <p :class="['bg-week-odd', 'container-lr-s','summary']">
      <span>+: {{data.income | currency}}</span>
      <span>-: {{data.expense | currency}}</span>
    </p> -->
  </div>
</template>

<script>
import { currency } from './../../filters/number.ts'

// import ItemBill from './RecordDetailItem.Bill'
import ItemBill from './RecordItem.Bill'
export default {
  props: {
    data: {
      type: [Object],
      default() {
        return {
          date: '',
          income: 0,
          expense: 0
        }
      }
    },
    index: {
      type: [Number],
      required: true
    }
  },
  data() {
    return {
      showDetail: true
    }
  },
  components: {
    ItemBill
  },
  filters: {
    currency(value) {
      return currency(value)
    }
  },
  methods: {
    toggleContent() {
      this.showDetail = !this.showDetail
    },
    _onItemAction(item) {
      this.$emit('onItemAction', { date: this.data.date, item: item })
    }
  }
}
</script>

<style lang="less">
@import (reference) './../../assets/css/main.less';
@week-bar-width: 180px;
@week-title-height: 40px;
.comp-vertical-record-bar {
  width: @week-bar-width;
  height: 100%;
  position: relative;
  overflow: hidden;
  // border-right: 1px solid @color-smoke;
  float: left;

  &:last-child {
    border-right: none;
  }

  h3 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: @week-title-height;

    text-align: center;
    line-height: @week-title-height;
  }

  h3 ~ .inner-container,
  h3 ~ .summary-container {
    top: @week-title-height;
  }

  .bg-week-even {
    color: @color-night;
    border: 1px solid @color-night;
    background-color: @color-day;
  }

  .bg-week-odd {
    background-color: @color-night;
    color: @color-day;
  }

  .summary-container {
    position: absolute;
    left: 0;
    width: @week-bar-width;
    height: calc(100% - @week-title-height);
    display: flex;
    flex-direction: column;
    & > * {
      flex: 1;
      .fx-center;
    }

    .income-container,
    .expense-container {
      padding: 20px 40px;
      // border: 1px solid @color-night;
      background-color: @color-night;
      color: @color-day;

      p {
        text-align: center;
        margin-bottom: 10px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }

  .inner-container {
    position: absolute;
    left: 0;
    height: 100%;
    padding-bottom: @week-title-height;
    overflow-x: hidden;
    overflow-y: scroll;

    .detail-list {
      width: @week-bar-width;
      height: 100%;
      background-color: @color-day;
      color: @color-day;
    }
  }

  .summary {
    display: flex;
    align-items: center;
    position: absolute;
    width: @week-bar-width;
    height: @week-title-height;
    bottom: 0;

    & > * {
      flex: 1;
      height: 100%;
      .fx-center;

      &:first-child {
        justify-content: flex-start;
      }

      &:last-child {
        justify-content: flex-end;
      }
    }
  }
}
</style>
