import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: null
  },
  actions: {
    login ({ commit }, username) {
      commit('login', username)
    },
    logout ({ commit }) {
      commit('logout')
    }
  },
  mutations: {
    login (state, username) {
      state.username = username
    },
    logout (state) {
      state.username = null
    }
  }
})
