<template>
  <div class="comp-book-item-filter-container">
    <div class="filter-form"
         v-if="showNumericOptions">
      <div class="fieldset">
        <label :class="['far','fa-dot-circle','icon-filter-radio', filterOptions.combine.selected ? 'selected' : '']"
               v-show="filterOptions.combine.selected"
               @click="selectFilterType(filterOptions.combine)"></label>
        <label class="far fa-circle icon-filter-radio"
               v-show="!filterOptions.combine.selected"
               @click="selectFilterType(filterOptions.combine)"></label>
        <section class="content-form combine-filter">
          <p class="ft-xl title">{{filterOptions.combine.title}}</p>
          <div class="options-container">
            <div class="combine-year-container">
              <el-date-picker type="year"
                              placeholder="按年份合并数据显示"
                              format="yyyy"
                              v-model="selectedOption.combine.year"
                              :clearable="__TRUTH__"
                              :class="['combine-year']"></el-date-picker>
            </div>
            <div class="combine-month-container">
              <el-date-picker type="month"
                              placeholder="按月份合并数据显示"
                              format="yyyy-MM"
                              v-model="selectedOption.combine.month"
                              :clearable="__TRUTH__"
                              :class="['combine-month']"></el-date-picker>
            </div>
          </div>
        </section>
      </div>
      <div class="fieldset">
        <label :class="['far','fa-dot-circle','icon-filter-radio', filterOptions.filter.selected ? 'selected' : '']"
               v-show="filterOptions.filter.selected"
               @click="selectFilterType(filterOptions.filter)"></label>
        <label class="far fa-circle icon-filter-radio"
               v-show="!filterOptions.filter.selected"
               @click="selectFilterType(filterOptions.filter)"></label>
        <section class="content-form group-filter">
          <p class="ft-xl title">{{filterOptions.filter.title}}</p>
          <div class="options-container">
            <div class="filter-month-container">
              <el-date-picker type="month"
                              placeholder="选择月份"
                              format="yyyy-MM"
                              v-model="selectedOption.filter.month"
                              :clearable="__TRUTH__"
                              :class="['filter-month']"></el-date-picker>
            </div>
          </div>
        </section>
      </div>
    </div>
    <div class="filter-form"
         v-if="showChartOptions">
      <div class="fieldset">
        <label :class="['far','fa-dot-circle','icon-filter-radio', filterOptions.filter.selected ? 'selected' : '']"
               v-show="filterOptions.filter.selected"
               @click="selectFilterType(filterOptions.filter)"></label>
        <label class="far fa-circle icon-filter-radio"
               v-show="!filterOptions.filter.selected"
               @click="selectFilterType(filterOptions.filter)"></label>
      </div>
    </div>
    <div class="btn-container">
      <button type="button"
              class="ft-l"
              @click.stop="undo">还原</button>
      <button type="button"
              class="ft-l"
              @click.stop="clearData">清除条件</button>
      <button type="button"
              class="ft-l"
              @click.stop="confirm">确定</button>
    </div>
  </div>
</template>

<script>
import VueNotifications from 'vue-notifications'
import { itemCategories } from '@/constants/category.ts'
import { itemFilterDesc } from '@/constants/string.ts'
export default {
  props: {
    oldCondition: {
      type: Object,
      default() {
        return {
          key: '',
          values: {}
        }
      }
    },
    // ['numeric', 'chart']
    filterType: {
      type: String,
      default() {
        return 'numeric'
      }
    }
  },
  computed: {
    showNumericOptions() {
      return this.filterType === 'numeric'
    },
    showChartOptions() {
      return this.filterType === 'chart'
    }
  },
  data() {
    return {
      filterOptions: {
        combine: {
          title: itemFilterDesc.COM,
          selected: false
        },
        filter: {
          title: itemFilterDesc.FIL,
          selected: false
        }
      },
      selectedOption: {
        combine: {
          year: '',
          month: ''
        },
        filter: {
          month: ''
        }
      },
      itemCategories: Object.values(itemCategories),
      itemFilterDesc: itemFilterDesc
    }
  },
  notifications: {
    selectFilterE: {
      type: VueNotifications.types.error,
      title: '',
      message: ''
    },
  },
  methods: {
    clearData() {
      Object.keys(this.filterOptions).forEach((v, i) => {
        this.filterOptions[v].selected = false
      })
      Object.keys(this.selectedOption).forEach((v, i) => {
        Object.keys(this.selectedOption[v]).forEach(val => {
          this.selectedOption[v][val] = ''
        })
      })
    },
    selectFilterType(item) {
      Object.keys(this.filterOptions).forEach(v => {
        this.filterOptions[v].selected = this.filterOptions[v].title === item.title
      })
    },
    confirm() {
      const result = {
        key: '',
        values: {}
      }
      let selectedField = ''
      Object.keys(this.filterOptions).forEach((v, i) => {
        this.filterOptions[v].selected ? selectedField = v : null
      })
      if (!selectedField) {
        this.selectFilterE({ message: '选择一种筛选类型' })
        return false
      }
      result.key = this.filterOptions[selectedField].title
      switch (this.filterOptions[selectedField].title) {
        case this.itemFilterDesc.COM:
          for (let key in this.selectedOption.combine) {
            this.selectedOption.combine[key] ? result.values[key] = this.selectedOption.combine[key] : null
          }
          break
        case this.itemFilterDesc.FIL:
          for (let key in this.selectedOption.filter) {
            this.selectedOption.filter[key] ? result.values[key] = this.selectedOption.filter[key] : null
          }
          break
      }
      this.$emit('onItemFilterConfirm', result)
    },
    undo() {
      this.$emit('onItemFilterUndo')
    }
  }
}
</script>

<style lang="less">
@import (reference) '~@/assets/css/main.less';
.comp-book-item-filter-container {
  position: relative;
  margin-left: 0;
  width: 360px;
  height: @content-height;
  background-color: @color-night;
  animation: drawerLeft 0.4s ease-in none;
  box-shadow: 0 0 20px #000;
  overflow: hidden;

  .filter-form {
    position: relative;
    overflow: hidden;
    .fieldset {
      display: flex;
      align-items: center;
      min-height: 60px;
      padding: 0 10px;
      border-bottom: 1px solid @color-day;

      .selected {
        color: @color-primary !important;

        & ~ * {
          color: @color-primary !important;
        }

        & ~ .content-form {
          border-left: 1px solid @color-primary !important;
        }
      }

      .icon-filter-radio {
        font-size: 20px;
        color: @color-day;
        margin-right: 10px;
      }

      .content-form {
        flex: 1;
        color: @color-day;
        min-height: 60px;
        border-left: 1px solid @color-day;
        padding: 10px 0;
        overflow: hidden;

        .title {
          margin-bottom: 10px;
          padding-left: 10px;
          text-align: center;
        }

        .options-container {
          padding-left: 10px;

          & > * {
            margin-bottom: 10px;
          }

          .filter-month-container,
          .combine-year-container,
          .combine-month-container {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;

            .filter-month,
            .combine-year,
            .combine-month {
              background-color: @color-day;
            }
          }
        }
      }
    }
  }

  .btn-container {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 50px;
    width: 100%;
    .fx-center;

    & > * {
      flex: 1;
      height: 100%;
      cursor: pointer;
      background-color: @color-day;
      color: @color-night;
      border: 1px solid @color-night;
      border-left: none;

      &:first-child {
        border-left: 1px solid @color-night;
      }

      &:hover {
        color: @color-primary;
      }
    }
  }
}
</style>
