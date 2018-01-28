import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/containers/Login';
import Main from '@/containers/Main';
import Markets from '@/containers/Markets';
import History from '@/containers/history';
import Assets from '@/containers/Assets';
import AutoTraders from '@/containers/auto-traders';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login',
        },
        {
            path: '/login',
            component: Login,
        },
        {
            path: '/main',
            component: Main,
            children: [
                {
                    path: 'markets',
                    component: Markets,
                },
                {
                    path: 'markets/:market/assets',
                    component: Assets,
                },
                {
                    path: 'markets/:market/histories',
                    component: History,
                },
                {
                    path: 'auto-traders',
                    component: AutoTraders,
                },
            ],
        },
    ],
});
