import Vue from 'vue'
import Vuetify from 'vuetify'
import Assets from '@/containers/Assets'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

describe('containers/Assets', function () {
  let vm
  let mockAxios
  before(() => {
    mockAxios = new MockAdapter(axios)
    mockAxios.onGet('/private/markets/poloniex/assets/BTC').reply(200, {
      status: 'success',
      result: {
        BTC: [
          {
            base: 'BTC',
            vcType: 'BTC',
            units: 0.4,
            rate: 1
          }
        ]
      }
    })
    Vue.use(Vuetify)
    const Constructor = Vue.extend(Assets)
    vm = new Constructor().$mount()
  })
  after(() => {
    mockAxios.restore()
  })
  describe('computed', () => {
    it('should return sorted bases array when bases', () => {
      let bases = vm.bases
      expect(bases.length).to.equal(1)
      expect(bases[0]).to.equal('BTC')
    })
    describe('listAssets', () => {
      before(() => {
        vm.assets = {
          'ETH': [
            {
              'base': 'BTC',
              'vcType': 'ETH',
              'units': 1,
              'rate': 0.1
            },
            {
              'base': 'BTC',
              'vcType': 'ETH',
              'units': 1,
              'rate': 0.2
            }
          ],
          'BTC': [
            {
              base: 'BTC',
              vcType: 'BTC',
              units: 0.4,
              rate: 1
            }
          ]
        }
      })
      it('should return summary at last of array when it call', () => {
        let arr = vm.listAssets
        expect(arr[0].vcType).to.equal('BTC')
      })
      it('should return sorted array by asc when it call', () => {
        let arr = vm.listAssets
        expect(arr.length).to.equal(3)
        expect(arr[0].vcType).to.equal('BTC')
        expect(arr[1].vcType).to.equal('ETH')
      })
      it('should return array of asset that has sum of units and average of rate when it call', () => {
        let arr = vm.listAssets
        expect(arr.length).to.equal(3)
        expect(arr[0].units.toFixed(1)).to.equal('0.4')
        expect(arr[0].rate).to.equal(1)
        expect(arr[1].units).to.equal(2)
        expect(arr[1].rate.toFixed(2)).to.equal('0.15')
      })
    })
  })
  describe('methods', () => {
    describe('loadAssetsByBase', () => {
      it('should set to assets when it call', done => {
        vm.loadAssetsByBase('BTC')
        setTimeout(() => {
          expect(vm.assets.BTC[0].units).to.equal(0.4)
          done()
        }, 100)
      })
    })
  })
})
