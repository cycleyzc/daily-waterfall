<template>
  <div class="comp-book-info-form">
    <p class="ft-l form-title">新增</p>
    <div class="fieldset">
      <label for="book_type"
             class="fieldset-label">类型: </label>
      <el-select v-model="selectedOption"
                 :class="['fieldset-value', error.type ? 'bd-error': '']"
                 placeholder="选一个"
                 :clearable="__TRUTH__"
                 id="book_type">
        <el-option v-for="(v, i) in bookTypes"
                   :key="i"
                   :value="v"></el-option>
      </el-select>
    </div>
    <div class="fieldset">
      <label for="book_name"
             class="fieldset-label">名称:</label>
      <el-input placeholder="输入名称"
                :class="['ft-m', 'fieldset-value', error.name ? 'bd-error': '']"
                :clearable="__TRUTH__"
                v-model="typedName"></el-input>
    </div>
    <div class="form-action">
      <i class="fas fa-times-circle like-btn"
         @click="onBookFormCancel"></i>
      <i class="fas fa-check-circle like-btn"
         @click="onBookFormConfirm"></i>
    </div>
  </div>
</template>

<script>
import { bookCategories } from '@/constants/category.ts'
export default {
  props: {
    checkField: {
      type: Boolean,
      default() {
        return true
      }
    },
    oldInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      bookTypes: Object.values(bookCategories),
      selectedOption: '',
      typedName: '',
      error: {
        type: '',
        name: ''
      }
    }
  },
  mounted() {
    if (Object.keys(this.oldInfo).length !== 0) {
      this.selectedOption = this.oldInfo.type
      this.typedName = this.oldInfo.name
    }
  },
  methods: {
    onBookFormCancel() {
      this.$emit('onBookFormCancel')
    },
    onBookFormConfirm() {
      Object.keys(this.error).forEach(v => {
        this.error[v] = ''
      })
      if (this.checkField) {
        if (!this.selectedOption) {
          this.error.type = '必填'
          return false
        }

        if (!this.typedName) {
          this.error.name = '必填'
          return false
        }
      }
      Object.keys(this.oldInfo).length !== 0 ?
        this.$emit('onBookFormUpadte', { type: this.selectedOption, name: this.typedName }) :
        this.$emit('onBookFormAdd', { type: this.selectedOption, name: this.typedName })
    }
  }
}
</script>

<style lang="less">
@import (reference) '~@/assets/css/main.less';
.comp-book-info-form {
  position: absolute;
  display: flex;
  align-items: center;
  flex-direction: column;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  background-color: @color-day;
  border-radius: 10px;
  color: @color-night;
  padding: 20px;

  & > * {
    width: 100%;
    .fx-center;
  }

  .form-title {
    margin-bottom: 10px;
  }

  .fieldset {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
    input[type='text'] {
      height: 36px;
      border: 1px solid #bbb;
      // text-indent: 1em;
      border-radius: 5px;
    }
    .dropdown {
      width: 100%;
      .dropdown-toggle {
        height: 36px;
      }
    }
    .bd-error {
      border-radius: 4px;
    }
    .fieldset-label {
      flex: 1;
    }

    .fieldset-value {
      flex: 4;
      background-color: #fff;
    }
  }

  .form-action {
    .fx-center;
    & > * {
      flex: 1;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 24px;
    }
  }
}
</style>
