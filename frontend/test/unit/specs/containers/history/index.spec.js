import Vue from 'vue';
import Vuetify from 'vuetify';
import axios from 'axios';
import MockAxiosAdapter from 'axios-mock-adapter';
import router from '../../../../../src/router';
import History from '@/containers/history';

describe('containers/history', function () {
    const MARKET = 'test-market';

    let vm;

    beforeEach(() => {
        const mockAxios = new MockAxiosAdapter(axios);
        mockAxios.onGet(`/private/markets/${MARKET}/histories/BTC`).reply(({params}) => {
            return [200, [
                {units: 1, rate: 1, vcType: 'tes-vctype', timestamp: 1},
                {units: 1, rate: 1, vcType: 'tes-vctype', timestamp: 90000000},
                {units: 1, rate: 1, vcType: 'tes-vctype', timestamp: 150000000},
            ].filter(h => h.timestamp >= params.start && h.timestamp <= params.end)];
        });

        Vue.use(Vuetify);
        const Constructor = Vue.extend(History);
        vm = new Constructor({router}).$mount();
        vm.$router.push(`/main/markets/${MARKET}/histories`);
    });

    afterEach(() => {
    });

    describe('computed', () => {
        describe('listHistories', () => {
            beforeEach(() => {
                vm.histories = [
                    {units: 1, rate: 1, vcType: 'a', timestamp: 1},
                    {units: 1, rate: 1, vcType: 'BTC', timestamp: 1},
                    {units: 1, rate: 1, vcType: 'b', timestamp: 1},
                ];
            });

            it('filter vcType equals BASE', () => {
                expect(vm.listHistories.length).to.equal(2);
                expect(vm.listHistories[0].vcType).to.equal('a');
                expect(vm.listHistories[1].vcType).to.equal('b');
            });

            it('filter not matched with coin text when coin text exists', () => {
                vm.conditions.coin = 'B';

                expect(vm.listHistories.length).to.equal(1);
                expect(vm.listHistories[0].vcType).to.equal('b');
            });

            it('do not filter when coin text does not exist', () => {
                vm.conditions.coin = '';

                expect(vm.listHistories.length).to.equal(2);
            });
        });
    });

    describe('methods', () => {
        beforeEach(() => {
            vm.conditions.startDate = '1970-01-01';
            vm.conditions.endDate = '1970-01-02';
        });

        describe('loadHistories', () => {
            it('call history with condition', done => {
                vm.loadHistories();
                setTimeout(() => {
                    expect(vm.histories.length).to.equal(2);
                    expect(vm.histories[0].timestamp).to.equal(1);
                    expect(vm.histories[1].timestamp).to.equal(90000000);
                    done();
                }, 100);
            });
        });

        describe('onChangeDate', () => {
            it('set searched histories to state', done => {
                vm.conditions.startDate = '1970-01-02';
                vm.onChangeDate();

                setTimeout(() => {
                    expect(vm.histories.length).to.equal(1);
                    expect(vm.histories[0].timestamp).to.equal(90000000);
                    done();
                }, 100);
            });
        });
    });
});
