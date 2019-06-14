<template>
  <div>
    <App-mask v-if="show.comp.itemForm">
      <Record-item-form :class="['form-pos']"
                        :categories="itemCategories"
                        :title="formTitle"
                        @onItemFormCancel="_hideInputForm"
                        @onItemFormConfirm="_onItemFormConfirm"
                        @onItemFromDelete="_deleteBookItem"
                        v-if="show.comp.itemForm"
                        :old-item="oldItem"
                        ref="itemForm"
                        slot="slot"></Record-item-form>
    </App-mask>
    <div class="view-records"
         @dblclick.stop.capture="showFeatureOptionsBar($event)">
      <Page-actions id="actions"
                    :actions="{left: 'fas fa-times', right: 'fas fa-times', top: 'fas fa-plus'}"
                    @onCenterAction="_hideFeatureBar"
                    @onTopAction="_addNewItem"
                    v-show="show.comp.featureBar"></Page-actions>

      <swiper :options="swiperOption"
              v-show="records.length !== 0 && !showSummary">
        <swiper-slide v-for="(v, i) in records"
                      :key="i">
          <V-record-bar :data="v"
                        :index="i"
                        @onItemAction="_onItemAction"></V-record-bar>
        </swiper-slide>
      </swiper>
      <i class="fab fa-creative-commons-nc-jp form-pos none"
         v-show="records.length === 0 || !showSummary">没数据</i>
      <!-- <span class="ft-xl form-pos none"
            v-show="records.length === 0">无数据</span> -->
      <swiper :options="swiperOption"
              v-show="showSummary">
        <swiper-slide v-for="(v, i) in recordsSum"
                      :key="i">
          <V-record-bar :data="v"
                        :index="i"
                        :back="__TRUTH__"></V-record-bar>
        </swiper-slide>
      </swiper>
    </div>
  </div>

</template>

<script>
import RecordDetail from '@/entity/RecordDetail.ts'

import { swiper, swiperSlide } from 'vue-awesome-swiper'
import VRecordBar from '@/components/business/VerticalRecordBar'
// import RecordActions from '@/components/public/other/Pie.3Actions'
import PageActions from '@/components/public/other/Chrome.Actions'
import RecordItemForm from '@/components/business/RecordItemForm'
import AppMask from '@/components/public/mask/Mask'

import { itemCategories } from '@/constants/category.ts'
import { weekNames, dateFormat } from '@/constants/date.ts'
import { itemFilterDesc } from '@/constants/string.ts'

import { formatDate } from '@/filters/date.ts'
import { currency } from '@/filters/number.ts'

const _recordDetail = new RecordDetail()
export default {
  props: ['bookID'],
  components: {
    swiper,
    swiperSlide,
    VRecordBar,
    // RecordActions,
    PageActions,
    RecordItemForm,
    AppMask
  },
  watch: {
    bookID(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.initData()
      }
    }
  },
  data() {
    return {
      itemCategories: Object.values(itemCategories),
      feeTypes: ['支出', '收入'],
      pickDate: new Date(),
      records: [],
      oldItem: {},
      formTitle: '',
      swiperOption: {
        slidesPerView: 6,
        spaceBetween: 1,
      },
      show: {
        comp: {
          featureBar: false,
          itemForm: false
        }
      },
      itemFilterDesc: itemFilterDesc,
      recordsSum: []
    }
  },
  computed: {
    showSummary() {
      return this.recordsSum.length !== 0
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    clearData() {
      this.records = []
      this.recordsSum = []
      this.show.comp.featureBar = false
      this.show.comp.itemForm = false
    },
    initData() {
      this.getRecords()
    },
    getRecords(date) {
      this.clearData()
      const d = date ? date : new Date()
      const year = d.getFullYear()
      const month = d.getMonth() + 1
      _recordDetail.queryAllByNotebook(this.bookID, { year, month })
        .then(res => {
          console.log('queryAllByNotebook', res)
          if (res.length !== 0) {
            const recordDates = new Set()
            const innerData = res.map(v => {
              v.date = formatDate(dateFormat.EN_YMD, v.timestamp)
              v.week = new Date(v.timestamp).getDay()
              v.weekName = weekNames[`_${v.week}`]
              recordDates.add(v.date)
              return v
            })
            this.records = Array.from(recordDates).map(v => {
              let data = {
                data: [],
                date: v,
                week: 0,
                income: 0,
                expense: 0
              }
              data.data = innerData.filter(val => v === val.date)
              // 当日收入总额
              data.income = data.data.reduce((prev, next) => {
                return { income: parseFloat(prev.income) + parseFloat(next.income) }
              }, { income: 0 }).income
              // 当日支出总额
              data.expense = data.data.reduce((prev, next) => {
                return { expense: parseFloat(prev.expense) + parseFloat(next.expense) }
              }, { expense: 0 }).expense
              data.week = data.data[0].week
              return data
            })
            // 按日期倒序
            this.records.sort((prev, next) => {
              return new Date(next.date).getTime() - new Date(prev.date).getTime()
            })
          } else {
            this.records = []
          }

        }, err => {

        })
    },
    showFeatureOptionsBar(event) {
      console.log('event', event)
      // 定位位置
      const domActions = document.getElementById('actions')
      domActions.style.top = `${event.y - (window.innerHeight - window.innerWidth * 0.46875) / 2}px`
      domActions.style.left = `${event.x - window.innerWidth * 0.078125}px`
      this.show.comp.featureBar = true
    },
    toggleInputForm(bool = false) {
      this.show.comp.itemForm = bool
    },
    confirmAddNewItem(item) {
      const timestamp = item.date.getTime()
      const income = item.feeType === '收入' ? item.amount : 0
      const expense = item.feeType === '支出' ? item.amount : 0
      _recordDetail.addNewItem({
        name: '',
        note: item.note,
        date: timestamp,
        category: item.category,
        income: income,
        expense: expense,
        parentID: this.bookID
      })
        .then(res => {
          console.log('_addNewItem', res)
          this.records = []
          this._hideInputForm()
          this.$refs.itemForm.init()
          this.initData()
          this.$parent.getBooks()
        }, err => {
          console.warn('_addNewItem', err)
        })
    },
    confirmUpdateItemField(id, item) {
      const diff = {}
      Object.keys(item).forEach(v => {
        item[v] != this.oldItem[v] ? diff[v] = item[v] : null
      })
      console.log('diff', diff, id, item)
      if (diff.hasOwnProperty('amount')) {
        item.feeType === '收入' ? diff.income = item.amount : null
        item.feeType === '支出' ? diff.expense = item.amount : null
        delete diff.amount
      }
      if (diff.hasOwnProperty('date')) {
        diff.timestamp = (new Date(diff.date)).getTime()
        delete diff.date
      }
      _recordDetail.updateField(id, diff)
        .then(res => {
          if (res) {
            this._hideInputForm()
            this.initData()
          } else {

          }
        })
    },
    _hideFeatureBar() {
      this.show.comp.featureBar = false
    },
    _addNewItem() {
      this._hideFeatureBar()
      this.oldItem = {}
      this.formTitle = '新建单项'
      this.toggleInputForm(true)
    },
    _hideInputForm() {
      this.toggleInputForm(false)
    },
    _onItemFormConfirm(item, id) {
      if (id) {
        this.confirmUpdateItemField(id, item)
      } else {
        this.confirmAddNewItem(item)
      }
    },
    _onItemAction(data) {
      console.log('data', data)
      this.formTitle = '修改单项'
      this.oldItem.id = data.item.id
      this.oldItem.category = data.item.category
      data.item.expense ? this.oldItem.feeType = '支出' : null
      data.item.income ? this.oldItem.feeType = '收入' : null
      this.oldItem.date = data.date
      this.oldItem.amount = data.item.expense || data.item.income
      this.oldItem.note = data.item.note
      this.toggleInputForm(true)
    },
    _deleteBookItem(item) {
      _recordDetail.removeItem({ id: item.id, parentID: this.bookID })
        .then(res => {
          console.log('del item', res)
          this._hideInputForm()
          this.$refs.itemForm.init()
          this.initData()
          this.$parent.getBooks()
        }, err => {
          console.warn('del item', err)
        })
    },
    filterRecords(condition) {
      this.getRecords(condition.values.month)
    },
    combineRecords(condition) {
      this.clearData()
      let query = {}
      condition.values.hasOwnProperty('year') ? query.year = new Date(condition.values.year).getFullYear() : null
      condition.values.hasOwnProperty('month') ? query.month = new Date(condition.values.month).getMonth() + 1 : null
      _recordDetail.queryAllByNotebook(this.bookID, query)
        .then(res => {
          console.log('combineRecords', res)

          // 合并条件下的总支出和总收入
          const expense = res.reduce((prev, next) => {
            return { expense: parseFloat(prev.expense) + parseFloat(next.expense) }
          }, { expense: 0 })
          const income = res.reduce((prev, next) => {
            return { income: parseFloat(prev.income) + parseFloat(next.income) }
          }, { income: 0 })
          const all = {
            date: '总计',
            income: income.income,
            expense: expense.expense,
            data: []
          }
          this.recordsSum.push(all)

          // 合并条件下, 各分类的支出和收入
          let category = []
          res.forEach(v => {
            category.indexOf(v.category) > -1 ? null : category.push(v.category)
          })
          category.forEach(v => {
            const thisCategoryRecords = res.filter(val => val.category === v)
            const obj = {
              date: v,
              expense: thisCategoryRecords.reduce((prev, next) => {
                return { expense: parseFloat(prev.expense) + parseFloat(next.expense) }
              }, { expense: 0 }).expense,
              income: thisCategoryRecords.reduce((prev, next) => {
                return { income: parseFloat(prev.income) + parseFloat(next.income) }
              }, { income: 0 }).income,
            }
            this.recordsSum.push(obj)
          })
        })
    }
  }
}
</script>

<style lang="less">
@import (reference) '~@/assets/css/main.less';
@import (reference) '~@/assets/css/business/bottomComtroller.less';
@router-view-height: @content-height - @controller-height;
@week-bar-width: 180px;
.view-records {
  position: relative;
  height: @router-view-height;
  .swiper-container {
    height: @router-view-height !important;
    background-color: @color-day;

    .swiper-wrapper {
      background-color: @color-day;
    }

    .swiper-slide {
      width: @week-bar-width !important;
    }
  }
}
.form-pos {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
}

.none {
  color: @color-day;
  font-size: 40px;

  &::before {
    margin-right: 20px;
  }

  &::after {
    content: '\F4EA';
    margin-left: 20px;
  }
}
</style>
