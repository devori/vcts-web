import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/containers/Login'
import Main from '@/containers/Main'
import History from '@/containers/History'
import Assets from '@/containers/Assets'
import AutoTrader from '@/containers/AutoTrader'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/main',
      component: Main,
      children: [
        {
          path: 'assets',
          component: Assets
        },
        {
          path: 'history',
          component: History
        },
        {
          path: 'auto-trader',
          component: AutoTrader
        }
      ]
    }
  ]
})
