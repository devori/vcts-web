import Vue from 'vue'
import Vuetify from 'vuetify'
import router from '@/router'
import Login from '@/containers/Login'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

describe('Login.vue', function () {
  const USERNAME = 'test-user'
  const CORRECT_PASSWORD = 'test-password'
  let vm
  let mockAxios

  before(() => {
    Vue.use(Vuetify)
    const Constructor = Vue.extend(Login)
    vm = new Constructor({
      router
    }).$mount()
    mockAxios = new MockAdapter(axios)

    mockAxios.onPost('/public/sessions', {
      username: USERNAME,
      password: CORRECT_PASSWORD
    }).reply(200, {
      status: 'success',
      result: 'Success'
    })
  })
  it('should move main page when login is success', done => {
    vm.username = 'test-user'
    vm.password = 'test-password'
    vm.onClickLogin()
    setTimeout(() => {
      expect(vm.$router.currentRoute.path).to.equal('/main')
      done()
    }, 1000)
    this.timeout(3000)
  })
})
