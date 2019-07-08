<template>
  <div class="chart-area view-chart">
    <div class="chart-condition-container">
      <div>
        <el-date-picker v-model="selectedOption.categoryFeePerMonth"
                        type="month"
                        :clearable="__TRUTH__"
                        placeholder="选择月份显示各项支出/收入">
        </el-date-picker>
      </div>
      <div>
        <el-date-picker v-model="selectedOption.categoryFeePerYear"
                        type="year"
                        :clearable="__TRUTH__"
                        placeholder="选择年份显示各项支出/收入">
        </el-date-picker>
      </div>
      <div>
        <el-date-picker v-model="selectedOption.feePerDay"
                        type="month"
                        :clearable="__TRUTH__"
                        placeholder="选择月份显示每天支出/收入">
        </el-date-picker>
      </div>
      <div>
        <el-date-picker v-model="selectedOption.feePerMonth"
                        type="year"
                        :clearable="__TRUTH__"
                        placeholder="选择年份显示每月支出/收入">
        </el-date-picker>
      </div>
      <div>
        <el-cascader placeholder="选择分类显示每月支出/收入"
                     :props="categoryCascade"
                     :clearable="__TRUTH__"
                     v-model="selectedCategoryNYear"
                     @change="changeCategoryCascade"></el-cascader>
      </div>
    </div>
    <div class="chart-pie-wrapper"
         v-if="showIncomePie || showExpensePie">
      <Chart-pie :chart-data="pieIncomeData"
                 chart-title="收入"
                 class="chart-pie-container"
                 v-if="showIncomePie && loadedChart"></Chart-pie>
      <Chart-pie :chart-data="pieExpenseData"
                 chart-title="支出"
                 class="chart-pie-container"
                 v-if="showExpensePie && loadedChart"></Chart-pie>
    </div>
    <div class="chart-line-wrapper"
         v-if="showFeeLine">
      <Chart-line :chart-data="lineData"
                  class="chart-line-container"
                  :chart-title="chartTitle"
                  v-if="showFeeLine && loadedChart"></Chart-line>
    </div>
    <div class="chart-bar-wrapper"
         v-if="showCategoryYearBar">
      <Chart-bar :chart-data="barData"
                 class="chart-bar-container"
                 :chart-title="chartTitle"
                 v-if="showCategoryYearBar && loadedChart"></Chart-bar>
    </div>
  </div>
</template>

<script>
import { rdColor } from '@/util'

import ChartBar from '@/components/public/chart/Bar'
import ChartPie from '@/components/public/chart/Pie'
import ChartLine from '@/components/public/chart/Line'

import RecordDetail from '@/entity/RecordDetail.ts'

import { itemCategories } from '@/constants/category.ts'
import { isNull } from 'util';

const _recordDetail = new RecordDetail()

export default {
  props: ['bookID'],
  components: {
    ChartBar,
    ChartPie,
    ChartLine
  },
  data() {
    return {
      categories: Object.values(itemCategories),
      pieIncomeData: {
        // labels: ['Foo', 'Bar'],
        // datasets: [
        //   {
        //     data: [10, 30],
        //     backgroundColor: [colors[0], colors[1]]
        //   }
        // ]
      },
      pieExpenseData: {},
      lineData: {},
      barData: {},
      selectedOption: {
        categoryFeePerMonth: '',
        categoryFeePerYear: '',
        feePerDay: '',
        feePerMonth: ''
      },
      oldSelected: '',
      oldSelectedValue: '',
      loadedChart: true,
      selectedCategory: '',
      selectedCategoryNYear: [],
      categoryCascade: {
        lazy: true,
        lazyLoad: (node, resolve) => {
          console.log('props', node)
          const { level, value } = node
          let nodes = []
          let id = Math.random()
          if (level == 0) {
            nodes = this.categories.map(v => {
              return {
                value: v,
                label: v,
                leaf: false
              }
            })
            resolve(nodes)
          } else if (level == 1) {
            _recordDetail.queryAllByNotebook(this.bookID, {}, { category: value })
              .then(res => {
                const years = []
                res.forEach(v => {
                  years.indexOf(v.year) < 0 ? years.push(v.year) : null
                })
                nodes = years.map(v => {
                  return {
                    value: v,
                    label: v,
                    leaf: true
                  }
                })
                resolve(nodes)
              })
          }

          // setTimeout(() => {
          //   const id = Math.random()
          //   const nodes = Array.from({ length: level + 1 })
          //     .map(item => ({
          //       value: id,
          //       label: `选项${id}`,
          //       leaf: level >= 2
          //     }));
          //   // 通过调用resolve将子节点数据返回，通知组件数据加载完成
          //   resolve(nodes);
          // }, 1000);
        }
      },
      chartTitle: ''
    }
  },
  computed: {
    showIncomePie() {
      return Object.keys(this.pieIncomeData).length > 0
    },
    showExpensePie() {
      return Object.keys(this.pieExpenseData).length > 0
    },
    showFeeLine() {
      return Object.keys(this.lineData).length > 0
    },
    showCategoryYearBar() {
      return Object.keys(this.barData).length > 0
    },
    conditionSelected() {
      return !!Object.values(this.selectedOption).reduce((prev, next) => prev || next) || this.selectedCategoryNYear.length !== 0
    }
  },
  watch: {
    'conditionSelected'(newVal, oldVal) {
      console.log('conditionSelected', newVal, oldVal)
      if (!newVal) {
        this.oldSelected = ''
        this.clearChartData()
      }
    },
    'selectedOption.categoryFeePerMonth'(newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.changeSelectedCondition('categoryFeePerMonth')
        this.getRecords()
      }
    },
    'selectedOption.categoryFeePerYear'(newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.changeSelectedCondition('categoryFeePerYear')
        this.getRecords()
      }
    },
    'selectedOption.feePerDay'(newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.changeSelectedCondition('feePerDay')
        this.getRecords()
      }
    },
    'selectedOption.feePerMonth'(newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.changeSelectedCondition('feePerMonth')
        this.getRecords()
      }
    },
  },
  methods: {
    clearOtherCondition(name) {
      Object.keys(this.selectedOption).forEach(v => {
        // debugger
        v !== name ? this.selectedOption[v] = '' : null
      })
      name !== 'category' ? this.selectedCategoryNYear = [] : null
    },
    clearChartData() {
      this.pieIncomeData = {}
      this.pieExpenseData = {}
      this.lineData = {}
      this.barData = {}
      // this.oldSelected = ''
    },
    getRecords() {
      this.clearChartData()
      const { date, query } = this.concatQuery()
      _recordDetail.queryAllByNotebook(this.bookID, date, query)
        .then(res => {
          console.log('getRecords', res)
          this.drawChart(res, { date, query })
        }, err => {

        })
    },
    inputCategory(e) {
      this.clearOtherCondition('category')
      this.selectedCategory = e
    },
    changeSelectedCondition(typeName) {
      this.oldSelected = typeName
      this.clearOtherCondition(typeName)
    },
    concatQuery() {
      let date = {}
      let query = {}
      switch (this.oldSelected) {
        case 'categoryFeePerMonth':
        case 'feePerDay':
          date.year = this.selectedOption[this.oldSelected].getFullYear()
          date.month = this.selectedOption[this.oldSelected].getMonth() + 1
          break
        case 'categoryFeePerYear':
        case 'feePerMonth':
          date.year = this.selectedOption[this.oldSelected].getFullYear()
          break
        case 'category':
          query.category = this.selectedCategoryNYear[0]
          date.year = this.selectedCategoryNYear[1]
          break
        default:
          const now = new Date()
          date.year = now.getFullYear()
          date.month = now.getMonth() + 1
          break
      }

      return { date, query }
    },
    drawChart(data, reqCon) {
      this.chartTitle = ''
      let colors = rdColor()
      // 饼图数据
      // 1. 单月份的每项分类的收支情况
      // 2. 单年份的每项分类的收支情况
      if (this.oldSelected === 'categoryFeePerMonth' || this.oldSelected === 'categoryFeePerYear') {

        let cats = []
        data.forEach(v => {
          cats.indexOf(v.category) < 0 ? cats.push(v.category) : null
        })
        let catsExpense = []
        catsExpense = cats.map(v => {
          const items = data.filter(val => v === val.category)
          const sum = items.length == 1 ? items[0] : items.reduce((prev, next) => { return { expense: parseFloat(prev.expense) + parseFloat(next.expense) } }, { expense: 0 })
          return sum.expense
        })

        let catsIncome = []
        catsIncome = cats.map(v => {
          const items = data.filter(val => v === val.category)
          const sum = items.length == 1 ? items[0] : items.reduce((prev, next) => { return { income: parseFloat(prev.income) + parseFloat(next.income) } }, { income: 0 })
          return sum.income
        })

        this.pieExpenseData = {
          labels: cats,
          datasets: [{ data: catsExpense, backgroundColor: [colors[0], colors[1], colors[2]] }]
        }
        this.pieIncomeData = {
          labels: cats,
          datasets: [{ data: catsIncome, backgroundColor: [colors[0], colors[1], colors[2]] }]
        }
      }

      // 折线图数据
      // 1.单月份下每日收支情况
      // 2.单年份下每月收支情况
      if (this.oldSelected === 'feePerDay' || this.oldSelected === 'feePerMonth') {
        let dates = []
        let datesDesc = []
        let datesIncome = []
        let datesExpense = []
        if (this.oldSelected === 'feePerDay') {
          this.chartTitle = `${reqCon.date.year}年${reqCon.date.month}月每日收支情况`
          data.forEach(v => {
            dates.indexOf(v.day) < 0 ? dates.push(v.day) : null
          })
          datesIncome = dates.map(v => {
            return data.filter(val => val.day === v).reduce((prev, next) => { return { income: parseFloat(prev.income) + parseFloat(next.income) } }, { income: 0 }).income
          })
          datesExpense = dates.map(v => {
            return data.filter(val => val.day === v).reduce((prev, next) => { return { expense: parseFloat(prev.expense) + parseFloat(next.expense) } }, { expense: 0 }).expense
          })
          datesDesc = dates.map(v => `${v}日`)
          console.log('feePerDay days', dates, datesIncome, datesExpense)
        }
        if (this.oldSelected === 'feePerMonth') {
          this.chartTitle = `${reqCon.date.year}年每月收支情况`
          data.forEach(v => {
            dates.indexOf(v.month) < 0 ? dates.push(v.month) : null
          })
          datesIncome = dates.map(v => {
            return data.filter(val => val.month === v).reduce((prev, next) => { return { income: parseFloat(prev.income) + parseFloat(next.income) } }, { income: 0 }).income
          })
          datesExpense = dates.map(v => {
            return data.filter(val => val.month === v).reduce((prev, next) => { return { expense: parseFloat(prev.expense) + parseFloat(next.expense) } }, { expense: 0 }).expense
          })
          datesDesc = dates.map(v => `${v}月`)

        }
        this.lineData = {
          labels: datesDesc,
          datasets: [
            {
              label: '支出',
              borderColor: colors[0],
              backgroundColor: colors[0],
              data: datesExpense,
              fill: false
            }, {
              label: '收入',
              borderColor: colors[1],
              backgroundColor: colors[1],
              data: datesIncome,
              fill: false
            }
          ]
        }
      }

      // 条形图数据
      // 1.单分类下单年份的每月收支情况
      if (this.oldSelected === 'category') {
        this.chartTitle = `${reqCon.query.category}分类下${reqCon.date.year}年每月收支情况`
        let months = []
        data.forEach(v => {
          months.indexOf(v.month) < 0 ? months.push(v.month) : null
        })
        let monthsIncome = ''
        let monthsExpense = ''

        monthsIncome = months.map(v => {
          return data.filter(val => val.month === v).reduce((prev, next) => { return { income: parseFloat(prev.income) + parseFloat(next.income) } }, { income: 0 }).income
        })
        monthsExpense = months.map(v => {
          return data.filter(val => val.month === v).reduce((prev, next) => { return { expense: parseFloat(prev.expense) + parseFloat(next.expense) } }, { expense: 0 }).expense
        })
        console.log('category', months, monthsIncome, monthsExpense)

        let monthsDesc = months.map(v => `${v}月`)
        this.barData = {
          labels: monthsDesc,
          datasets: [
            {
              label: '收入',
              backgroundColor: colors[0],
              data: monthsIncome
            },
            {
              label: '支出',
              backgroundColor: colors[1],
              data: monthsExpense
            }
          ]
        }
      }
    },
    changeCategoryCascade(e) {
      this.changeSelectedCondition('category')
      this.getRecords()
    }
  }
}
</script>

<style lang="less">
@import (reference) '~@/assets/css/main.less';
@import (reference) '~@/assets/css/business/bottomComtroller.less';
@router-view-height: @content-height - @controller-height;
@condition-height: 50px;
.chart-area {
  border-top: 1px solid @color-night;
  border-left: 1px solid @color-night;
  border-right: 1px solid @color-night;
}
.view-chart {
  position: relative;
  height: @router-view-height;
  background-color: @color-day;

  .chart-condition-container {
    width: 100%;
    height: @condition-height;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    background-color: @color-night;
    color: @color-day;

    & > * {
      // flex: 1;
      width: 180px;
      height: 36px;
      // overflow: hidden;
      border-radius: 3px;
      .fx-center;
    }

    input {
      background-color: @color-day !important;
    }

    .multiselect {
      * {
        background-color: @color-day !important;
        color: @color-night !important;
      }
      .multiselect__tags {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .mx-datepicker {
      width: 100%;
      height: 36px;
      * {
        color: @color-night !important;
      }
      input {
        height: 36px !important;
      }
    }

    .dropdown {
      width: 100%;
    }

    .dropdown-toggle {
      background-color: @color-day !important;
    }
  }

  .chart-pie-wrapper {
    width: @content-width;
    height: @router-view-height - @condition-height;
    .fx-center;

    .chart-pie-container {
      width: @content-width - 100px;
      height: 100%;
      padding-top: 20px;
      padding-bottom: 20px;
      overflow: hidden;
    }
  }

  .chart-line-wrapper {
    width: @content-width;
    height: @router-view-height - @condition-height;
    .fx-center;

    .chart-line-container {
      width: @content-width;
      height: 100%;
      padding: 20px 40px;
      overflow: hidden;
    }
  }

  .chart-bar-wrapper {
    width: @content-width;
    height: @router-view-height - @condition-height;
    .fx-center;

    .chart-bar-container {
      width: @content-width;
      height: 100%;
      padding: 20px 40px;
      overflow: hidden;
    }
  }
}
</style>
