import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        username: null,
    },
    actions: {
        login ({commit}, username) {
            commit('login', username);
        },
        logout ({commit}) {
            commit('logout');
        },
        updateSession ({commit}) {
            return axios.get('/public/session').then(res => {
                commit('login', res.data.username);
                return res.data.username;
            }).catch(() => {
                commit('logout');
                return null;
            });
        },
    },
    mutations: {
        login (state, username) {
            state.username = username;
        },
        logout (state) {
            state.username = null;
        },
    },
});
