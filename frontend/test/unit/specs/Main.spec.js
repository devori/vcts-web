import Vue from 'vue'
import Vuetify from 'vuetify'
import router from '@/router'
import Main from '@/containers/Main'

describe('Assets.vue', function () {
  let vm
  before(() => {
    Vue.use(Vuetify)
    const Constructor = Vue.extend(Main)
    vm = new Constructor({
      router
    }).$mount()
    vm.$router.replace('/main/assets')
  })
  after(() => {
  })
  describe('computed', () => {
    it('should return last word of route.path when it call', () => {
      expect(vm.title).to.equal('Assets')
    })
  })
  describe('methods', () => {
    describe('movePage', () => {
      it('should change path of router when it call', () => {
        vm.movePage('/a/b/c')
        expect(vm.$route.path).to.equal('/a/b/c')
      })
    })
  })
})
