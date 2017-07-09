import Vue from 'vue'
import Vuetify from 'vuetify'
import router from '@/router'
import store from '@/store'
import Login from '@/containers/Login'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

describe('Login.vue', function () {
  const USERNAME = 'test-user'
  const CORRECT_PASSWORD = 'test-password'
  let vm
  let mockAxios
  let Constructor

  before(() => {
    Vue.use(Vuetify)
    Constructor = Vue.extend(Login)
    vm = new Constructor({
      router,
      store
    }).$mount()
    mockAxios = new MockAdapter(axios)

    mockAxios.onPost('/public/session', {
      username: USERNAME,
      password: CORRECT_PASSWORD
    }).reply(200, {
      status: 'success',
      result: 'Success'
    })
  })
  after(() => {
    mockAxios.restore
  })
  it('should change state when login is success', done => {
    expect(vm.$store.state.username).to.null
    vm.username = USERNAME
    vm.password = CORRECT_PASSWORD
    vm.onClickLogin()
    setTimeout(() => {
      expect(vm.$store.state.username).to.equal('test-user')
      done()
    }, 1000)
    this.timeout(3000)
  })
  it('should move page to main/assets when state.username exist', () => {
    vm.$destroy()
    vm = new Constructor({
      router,
      store
    })
    vm.$store.dispatch('login', USERNAME)
    vm.$mount()
    expect(vm.$router.currentRoute.path).to.equal('/main/assets')
  })
})
