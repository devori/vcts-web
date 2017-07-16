import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/containers/Login'
import Main from '@/containers/Main'
import Assets from '@/containers/Assets'

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
        }
      ]
    }
  ]
})
