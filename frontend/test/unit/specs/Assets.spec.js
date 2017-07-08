import Vue from 'vue'
import Vuetify from 'vuetify'
import Assets from '@/containers/Assets'

describe('Assets.vue', function () {
  let vm
  before(() => {
    Vue.use(Vuetify)
    const Constructor = Vue.extend(Assets)
    vm = new Constructor().$mount()
    vm.items = [
      {
        'base': 'USDT',
        'vcType': 'DASH',
        'units': 0.4,
        'price': 2500,
        'timestamp': 1,
        'uuid': '1'
      },
      {
        'base': 'BTC',
        'vcType': 'ETH',
        'units': 1,
        'price': 0.1,
        'timestamp': 2,
        'uuid': '2'
      },
      {
        'base': 'USDT',
        'vcType': 'BTC',
        'units': 0.5,
        'price': 2600,
        'timestamp': 3,
        'uuid': '3'
      }
    ]
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
    it('should return items matched base when filterByBase call', () => {
      let filtered = vm.filterByBase('USDT')
      expect(filtered.length).to.equal(2)
      expect(filtered[0].base).to.equal('USDT')
      expect(filtered[0].vcType).to.equal('BTC')
    })
  })
})
