import Vue from 'vue'
import Vuetify from 'vuetify'
import AutoTrader from '@/containers/AutoTrader'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

describe('containers/AutoTrader', function () {
  let vm
  let mockAxios
  before(() => {
    mockAxios = new MockAdapter(axios)
    mockAxios.onGet('/private/auto-traders').reply(200, {
      poloniex: { interval: 3600000 }
    })
    Vue.use(Vuetify)
    const Constructor = Vue.extend(AutoTrader)
    vm = new Constructor().$mount()
  })
  after(() => {
    mockAxios.restore()
  })
  describe('computed', () => {
  })
  describe('methods', () => {
    describe('loadAutoTraders', () => {
      it('should set to traders when it call', done => {
        vm.loadAutoTraders()
        setTimeout(() => {
          expect(vm.traders.poloniex.interval).to.equal(3600000)
          done()
        }, 100)
      })
    })
  })
})
