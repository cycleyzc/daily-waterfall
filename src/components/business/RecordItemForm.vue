<template>
  <div class="comp-record-item-form">
    <h3>{{title}}</h3>
    <div class="fieldset"
         category>
      <label>分类: </label>
      <el-select v-model="selectedCategory"
                 :class="['field', 'field-select-category', showError.category ? 'bd-error': '']"
                 :clearable="__TRUTH__">
        <el-option v-for="(v, i) in categories"
                   :key="i"
                   :value="v"></el-option>
      </el-select>
    </div>
    <div class="fieldset"
         fee-type>
      <label>收支: </label>
      <el-select v-model="selectedFeeType"
                 :class="['field', 'field-select-fee', showError.feeType ? 'bd-error': '']"
                 :clearable="__TRUTH__">
        <el-option v-for="(v, i) in feeTypes"
                   :key="i"
                   :value="v"></el-option>
      </el-select>
    </div>
    <div class="fieldset"
         date>
      <label>日期: </label>
      <el-date-picker type="date"
                      :clearable="__TRUTH__"
                      v-model="selectedDate"
                      :class="[showError.date ? 'bd-error': '']"></el-date-picker>
    </div>
    <div class="fieldset"
         amount>
      <label>金额: </label>
      <div :class="['input-wrapper', showError.amount ? 'bd-error': '']">
        <!-- <input type="number"
               v-model="amount"
               class="mx-input"
               placeholder="金额" /> -->
        <el-input-number v-model="amount"
                         placeholder="金额"
                         :clearable="__TRUTH__"></el-input-number>
      </div>
    </div>
    <div class="fieldset"
         note>
      <label>备注: </label>
      <div class="input-wrapper">
        <!-- <input type="text"
               v-model="note"
               class="mx-input"
               placeholder="备注, 最多15字"
               maxlength="15" /> -->
        <el-input v-model="note"
                  placeholder="备注, 最多15字"
                  maxlength="15"
                  :clearable="__TRUTH__"></el-input>
      </div>
    </div>
    <div class="action-container">
      <i class="fas fa-trash-alt ft-xl like-btn"
         @click="del"
         v-show="oldItem.id"></i>
      <i class="fas fa-times ft-xl like-btn"
         @click="cancel"></i>
      <i class="fas fa-check ft-xl like-btn"
         @click="confirm"></i>
    </div>
  </div>
</template>

<script>
import { itemCategories } from '@/constants/category.ts'
export default {
  props: {
    title: {
      type: String,
      default() {
        return '新建单项'
      }
    },
    oldItem: {
      type: Object,
      default() {
        return {
          id: '',
          category: '',
          feeType: '',
          date: '',
          amount: '',
          note: ''
        }
      }
    },
    categories: {
      type: Array,
      default() {
        return Object.values(itemCategories)
      }
    },
    feeTypes: {
      type: Array,
      default() {
        return ['支出', '收入']
      }
    }
  },
  data() {
    return {
      selectedCategory: '',
      selectedFeeType: '',
      selectedDate: '',
      amount: 0,
      note: '',
      showError: {
        category: false,
        feeType: false,
        date: false,
        amount: false
      }
    }
  },
  computed: {
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      Object.keys(this.showError).forEach(v => {
        this.showError[v] = false
      })
      this.selectedCategory = this.oldItem.category ? this.oldItem.category : this.categories[0]
      this.selectedFeeType = this.oldItem.feeType ? this.oldItem.feeType : this.feeTypes[0]
      this.selectedDate = this.oldItem.date ? this.oldItem.date : new Date()
      this.amount = this.oldItem.amount ? this.oldItem.amount : 0
      this.note = this.oldItem.note ? this.oldItem.note : ''
    },
    del() {
      this.$emit('onItemFromDelete', this.oldItem)
    },
    cancel() {
      this.init()
      this.$emit('onItemFormCancel')
    },
    confirm() {
      this.showError.category = !!!this.selectedCategory
      this.showError.feeType = !!!this.selectedFeeType
      this.showError.date = !!!this.selectedDate
      this.showError.amount = !!!this.amount

      let fail = Object.values(this.showError).some(v => v === true)

      this.note.length > 15 ? fail = true : null

      if (fail) {
        return false
      } else {
        this.$emit('onItemFormConfirm', { category: this.selectedCategory, feeType: this.selectedFeeType, date: this.selectedDate, amount: this.amount, note: this.note }, this.oldItem.id)
      }
    }
  }
}
</script>

<style lang="less">
@import (reference) '~@/assets/css/main.less';
.comp-record-item-form {
  width: 300px;
  background-color: @color-day;

  h3 {
    width: 100%;
    text-align: center;
    margin-bottom: 20px;
  }

  .fieldset {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    height: 40px;

    & > label {
      flex: 1;
    }

    & > * {
      &:last-child {
        flex: 3;
        background-color: #fff;
      }
    }

    .input-wrapper {
      & > div {
        width: 100%;
      }
    }
  }

  .action-container {
    height: 40px;
    .fx-center;
    & > * {
      flex: 1;
      text-align: center;
      height: 100%;
      .fx-center;
    }
  }
}
</style>
