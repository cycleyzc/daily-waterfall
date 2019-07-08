import Vue from 'vue'
import VueNotifications from 'vue-notifications'
import iziToast from 'izitoast'

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
