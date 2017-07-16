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
  if (to.path === '/login') {
    next('/main/assets')
  } else if (to.path.startsWith('/main') && !store.state.username) {
    next('/login')
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  router,
  store,
  el: '#app',
  template: '<App/>',
  components: { App }
})
