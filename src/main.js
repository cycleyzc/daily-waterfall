import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vSelect from 'vue-select'
import vDatePicker from 'vue2-datepicker'
import VueNotifications from 'vue-notifications'
import iziToast from 'izitoast'
import 'izitoast/dist/css/iziToast.css'
import './registerServiceWorker'
import '@fortawesome/fontawesome-free/css/all.css'
import 'swiper/dist/css/swiper.css'

function toast ({ title, message, type, timeout, cb }) {
  if (type === VueNotifications.types.warn) type = 'warning'
  return iziToast[type]({ title, message, timeout, position: 'topRight' })
}
const options = {
  success: toast,
  error: toast,
  info: toast,
  warn: toast
}

Vue.use(VueNotifications, options)
Vue.component('v-select', vSelect)
Vue.component('v-date-picker', vDatePicker)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
