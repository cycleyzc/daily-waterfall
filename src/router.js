import Vue from 'vue'
import Router from 'vue-router'

const MoneyTracker = () =>
  import(/* webpackChunkName: "money-tracker" */ './views/moneyTracker/Main.vue')
const MoneyTrackerRecord = () =>
  import(/* webpackChunkName: "money-tracker" */ './views/moneyTracker/children/Record.vue')
const MoneyTrackerChart = () =>
  import(/* webpackChunkName: "money-tracker" */ './views/moneyTracker/children/Chart.vue')

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/home',
    //   name: 'home',
    //   alias: '/',
    //   component: Home
    // },
    {
      path: '/money-tracker',
      name: 'money-tracker',
      alias: '/',
      component: MoneyTracker,
      children: [
        {
          path: 'mt-record/:bookID',
          name: 'mt-record',
          component: MoneyTrackerRecord,
          props: true
        },
        {
          path: 'mt-chart/:bookID',
          name: 'mt-chart',
          component: MoneyTrackerChart
        }
      ]
    }
  ]
})
