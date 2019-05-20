<template>
  <div class="container-lr-s container-tb-s comp-item-bill">
    <p class="info">
      <span>
        <i class="ft-l fas fa-file-alt pre-icon"></i>
        {{item.category}}
      </span>
      <span v-if="item.expense">-{{item.expense | currency}}</span>
      <span v-if="item.income">{{item.income | currency}}</span>
    </p>
    <p class="note"
       v-if="item.note">
      {{item.note}}
    </p>
  </div>
</template>

<script>
import { currency } from './../../filters/number.ts'
export default {
  props: {
    item: {
      type: Object,
      default() {
        return {
          category: '',
          expense: 0,
          income: 0,
          note: ''
        }
      }
    }
  },
  filters: {
    currency(value) {
      return currency(value)
    }
  }
}
</script>

<style lang="less">
@import (reference) './../../assets/css/main.less';
.comp-item-bill {
  height: 100px;
  display: flex;
  flex-direction: column;
  color: @color-day;
  & > p {
    flex: 1;
  }

  .info {
    .fx-center;

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

    .pre-icon {
      margin-right: 6px;
    }
  }
}
</style>
