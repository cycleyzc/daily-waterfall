import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'

// 第三方插件加载器
import './loaders/element'
import './loaders/iziToast'

import '@fortawesome/fontawesome-free/css/all.css'
import 'swiper/dist/css/swiper.css'

Vue.config.productionTip = false

Vue.prototype.__TRUTH__ = true
Vue.prototype.__FAKE__ = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
