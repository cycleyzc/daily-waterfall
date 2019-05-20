<template>
  <div class="view-money-tracker">
    <div class="router-view">
      <router-view ref="childrenView"></router-view>
    </div>
    <div>
      <mt-controller :book="currentBook"
                     :show="controllerVisibility"
                     @onToggleRoute="_toggleRoute"
                     @onBookListAction="_showBookList"
                     @onIconAddAction="toAddBook"></mt-controller>
    </div>
    <div class="invisible-mask"
         v-if="compVisibility.bookList">
      <div :class="['placeholder', hideAnimation]"
           @click.self="hideMask"></div>
      <div class="book-list-container"
           v-show="compVisibility.bookList">
        <p class="container-lr-s color-primary ft-xl list-title">账本列表</p>
        <ul>
          <li v-for="(v,i) in books"
              :key="i"
              :class="[v.selected ? 'selected' : '']">
            <i class="fas fa-book like-btn icon-cover"
               @click="switchBook(v)"></i>
            <section>
              <p class="book-name">{{v.name}}</p>
              <p class="book-summary">{{v.type}} 共{{v.count}}条</p>
            </section>
            <i class="fas fa-pen-square like-btn ft-xxl action-icon"
               @click="toUpadteBook(v)"></i>
            <i class="fas fa-minus-square like-btn ft-xxl action-icon"
               v-if="!v.selected"
               @click="deleteBook(v)"></i>
          </li>
        </ul>
      </div>
    </div>
    <App-mask v-if="showAppMask">
      <Book-info-form slot="slot"
                      :old-info="oldBook"
                      @onBookFormCancel="toggleBookForm(false)"
                      @onBookFormAdd="_confirmAddNewBook"
                      @onBookFormUpadte="_confirmUpadteBook"
                      v-if="compVisibility.bookInfoForm"></Book-info-form>
    </App-mask>
  </div>
</template>

<script>
import VueNotifications from 'vue-notifications'

import mtController from '@/components/business/BottomController'
import AppMask from '@/components/public/mask/Mask'
import BookInfoForm from '@/components/business/BookInfoForm'

import Notebook from '@/entity/Notebook.ts'

import { fn } from '@/views/initFnMap.ts'
import { MSG_TEMPLATE, renderSentence } from '@/common/message.ts'

const _notebook = new Notebook()

export default {
  components: {
    mtController,
    AppMask,
    BookInfoForm
  },
  data() {
    return {
      currentBook: {},
      books: [],
      controllerVisibility: {
        mainIcon: true,
        recordIcon: false,
        chartIcon: false,
        bookInfo: false,
      },
      compVisibility: {
        bookList: false,
        bookInfoForm: false
      },
      hideAnimation: '',
      selectedBookID: localStorage.getItem('NOTEBOOK_ID') || -1,
      oldBook: {}
    }
  },
  computed: {
    showAppMask() {
      return this.compVisibility.bookInfoForm
    }
  },
  watch: {
  },
  notifications: {
    toastBookS: {
      type: VueNotifications.types.success,
      title: '',
      message: ''
    },
    toastBookE: {
      type: VueNotifications.types.error,
      title: '',
      message: ''
    },
  },
  beforeRouteUpdate(to, from, next) {
    if (to.name == from.name) {
      this.getBooks()
    }
    next()
  },
  mounted() {
    this.getBooks()
  },
  methods: {
    // 获取全部账本
    getBooks() {
      _notebook.queryAll()
        .then(res => {
          console.log('allbook', res)
          this.books = res.map(v => {
            v.selected = v.id == this.selectedBookID
            return v
          })
          if (this.selectedBookID != -1) {
            this.currentBook = this.books.filter(v => v.id == this.selectedBookID)[0]
            this.controllerVisibility.mainIcon = false
            this.controllerVisibility.recordIcon = true
            this.controllerVisibility.chartIcon = false
            this.controllerVisibility.bookInfo = true

            this.$router.replace({
              path: `/mt-record/${this.selectedBookID}`
            })
          }
        })
    },
    hideMask() {
      this.hideAnimation = 'hide-mask'
      setTimeout(() => {
        this.compVisibility.bookList = false
        this.hideAnimation = ''
      }, 300)
    },
    // 切换账本
    switchBook(item) {
      // console.log('router', this.$route, item)
      localStorage.setItem('NOTEBOOK_ID', item.id)
      this.selectedBookID = item.id
      this.currentBook = item
      this.$router.replace({
        name: this.$route.name,
        params: {
          id: item.id
        }
      })
    },
    deleteBook(item) {
      _notebook.removeOldBook(item.id)
        .then(res => {
          this.toastBookS({ message: renderSentence(MSG_TEMPLATE.DEL_BOOK_S, { bookName: item.name }) })
          this.getBooks()
        }, err => {
          this.toastBookS({ message: renderSentence(MSG_TEMPLATE.DEL_BOOK_F, { bookName: item.name }) })
        })
    },
    toAddBook() {
      this.oldBook = {}
      this.toggleBookForm(true)
    },
    toUpadteBook(item) {
      this.oldBook.name = item.name
      this.oldBook.type = item.type
      this.toggleBookForm(true)
    },
    toggleBookForm(bool = false) {
      this.compVisibility.bookInfoForm = bool
    },
    // 切换视图
    _toggleRoute(type) {
      switch (String(type)) {
        case 'record':
          this.controllerVisibility.mainIcon = false
          this.controllerVisibility.recordIcon = true
          this.controllerVisibility.chartIcon = false
          this.$router.replace({
            path: `/mt-record/${this.selectedBookID}`
          })
          break
        case 'chart':
          this.controllerVisibility.mainIcon = false
          this.controllerVisibility.recordIcon = false
          this.controllerVisibility.chartIcon = true
          this.$router.replace({
            path: `/mt-chart/${this.selectedBookID}`
          })
          break
      }
    },
    _showBookList() {
      this.compVisibility.bookList = true
    },

    // 新增账本
    _confirmAddNewBook({ type, name }) {
      console.log('_confirmAddNewBook', type, name)
      _notebook.createNewBook(name, type)
        .then(res => {
          this.toastBookS({ message: renderSentence(MSG_TEMPLATE.NEW_BOOK_S, { bookName: name }) })
          this.toggleBookForm(false)
          this.getBooks()
        }, err => {
          this.toastBookE({ message: renderSentence(MSG_TEMPLATE.NEW_BOOK_F) })
        })
    },
    // 修改账本信息
    _confirmUpadteBook({ type, name }) {
      _notebook.updateField(parseInt(this.selectedBookID), { name: name, type: type })
        .then(res => {
          console.log('_confirmUpadteBook', res)
          this.toggleBookForm(false)
          location.reload()
        }, err => {
          console.warn('_confirmUpadteBook', err)
        })
    }
  }
}
</script>

<style lang="less">
@import (reference) './../../assets/css/main.less';
.view-money-tracker {
  position: fixed;
  top: 50%;
  left: 50%;
  display: flex;
  width: @content-width;
  height: @content-height;
  background-color: @color-night;
  transform: translate(-50%, -50%);
  flex-direction: column;

  .router-view {
    flex: 1;
  }

  .invisible-mask {
    position: fixed;
    width: @content-width;
    height: @content-height;
    z-index: 39;
    display: flex;
    overflow: hidden;

    .placeholder {
      flex: 1;
      height: @content-height;
    }

    .hide-mask + * {
      animation: drawerHide 0.3s ease-in none !important;
    }
  }

  .book-list-container {
    margin-right: 0;
    width: 300px;
    height: @content-height;
    background-color: @color-night;
    animation: drawerShow 0.4s ease-in none;
    box-shadow: 0 0 20px #000;

    .list-title {
      height: 60px;
      .fx-center;
      border-bottom: 1px solid @color-day;
    }

    ul {
      height: @content-height - 60px;
      overflow-y: auto;
      overflow-x: hidden;

      &:after {
        content: '';
        clear: both;
      }

      li {
        display: flex;
        width: 100%;
        overflow: hidden;
        padding: 20px;
        border-bottom: 1px solid @color-day;
        color: @color-day;

        &:last-child {
          border-bottom: none;
        }

        section {
          flex: 1;
          height: 50px;
          display: flex;
          flex-direction: column;
          max-width: 150px;
          overflow: hidden;
          margin-right: 10px;
          & > * {
            flex: 1;
            display: flex;
            align-items: center;

            &:first-child {
              font-size: 20px;
              align-items: flex-start;
            }

            &:last-child {
              align-items: flex-end;
            }
          }

          .book-name {
            white-space: nowrap;
          }
        }

        i {
          border-radius: 5px;
        }

        .icon-cover {
          font-size: 30px;
          width: 50px;
          height: 50px;
          margin-right: 10px;
          border: 1px solid @color-day;
          .fx-center;
        }

        .action-icon {
          .fx-center;
          margin-right: 10px;

          &:last-child {
            margin-right: 0;
          }
        }
      }

      .selected {
        color: @color-primary;

        .icon-cover {
          border: 1px solid @color-primary !important;
        }
      }
    }
  }

  @keyframes drawerShow {
    0% {
      margin-right: -360px;
    }
    100% {
      margin-right: 0;
    }
  }

  @keyframes drawerHide {
    0% {
      margin-right: 0;
    }
    100% {
      margin-right: -360px;
    }
  }
}
</style>
