// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import axios from 'axios'
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.prototype.$http = axios

Vue.use(Vuetify)

router.beforeEach((to, from, next) => {
  if (to.path === '/login' && store.state.username) {
    next('/main/markets')
  } else if (to.path.startsWith('/main') && !store.state.username) {
    store.dispatch('updateSession').then(username => {
      if (!username) {
        next('/login')
      } else {
        next()
      }
    })
  } else {
    next()
  }
})

axios.interceptors.response.use(res => {
  if (res.data.code === 401) {
    this.$store.dispatch('logout')
  }
  return res
})

/* eslint-disable no-new */
new Vue({
  router,
  store,
  el: '#app',
  template: '<App/>',
  components: { App }
})
