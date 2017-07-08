import Vue from 'vue'
import Vuetify from 'vuetify'
import Assets from '@/containers/Assets'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

describe('Assets.vue', function () {
  const ASSETS = {
    'USDT': {
      'DASH': [
        {
          'base': 'USDT',
          'vcType': 'DASH',
          'units': 1,
          'price': 300,
          'timestamp': 123,
          'uuid': '265dac7d-1aaa-46b0-9f46-6dac2f45f44f'
        }
      ],
      'BTC': [
        {
          'base': 'USDT',
          'vcType': 'BTC',
          'units': 0.4,
          'price': 2500,
          'timestamp': 123,
          'uuid': '265dac7d-1aaa-46b0-9f46-6dac2f45f44f'
        }
      ]
    },
    'BTC': {
      'ETH': [
        {
          'base': 'BTC',
          'vcType': 'ETH',
          'units': 1,
          'price': 0.1,
          'timestamp': 123,
          'uuid': '265dac7d-1aaa-46b0-9f46-6dac2f45f44f'
        }
      ]
    }
  }
  let vm
  let mockAxios
  before(() => {
    Vue.use(Vuetify)
    const Constructor = Vue.extend(Assets)
    vm = new Constructor().$mount()
    vm.assets = ASSETS

    mockAxios = new MockAdapter(axios)
    mockAxios.onGet('/private/markets/poloniex/assets').reply(200, {
      status: 'success',
      result: ASSETS
    })
  })
  after(() => {
    mockAxios.restore()
  })
  describe('computed', () => {
    it('should return sorted bases array when bases', () => {
      let bases = vm.bases
      expect(bases.length).to.equal(2)
      expect(bases[0]).to.equal('BTC')
      expect(bases[1]).to.equal('USDT')
    })
  })
  describe('methods', () => {
    it('should load assets when page mount', done => {
      vm.assets = []
      vm.loadAssets()
      setTimeout(() => {
        expect(vm.assets.USDT).to.exist
        expect(vm.assets.BTC).to.exist
        done()
      }, 1000)
      this.timeout(3000)
    })
    it('should return array matched base when listByBase', () => {
      let list = vm.listByBase('USDT')
      expect(list.length).to.equal(2)
    })
  })
})
