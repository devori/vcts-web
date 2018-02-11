import Vue from 'vue';
import Vuetify from 'vuetify';
import moment from 'moment';
import axios from 'axios';
import sinon from 'sinon';
import router from '../../../../../src/router';
import History from '@/containers/history';

describe('containers/history', function () {
    const MARKET = 'test-market';

    let vm;

    beforeEach(() => {
        sinon.stub(axios, 'get').resolves({
            data: [
                {vcType: 'a', units: 0, rate: 1},
                {vcType: 'b', units: 0, rate: 1},
                {vcType: 'c', units: 0, rate: 1}
            ],
        });

        Vue.use(Vuetify);
        const Constructor = Vue.extend(History);
        vm = new Constructor({router}).$mount();
        vm.$router.push(`/main/markets/${MARKET}/histories`);
    });

    afterEach(() => {
        axios.get.restore();
    });

    describe('computed', () => {
        describe('listHistories', () => {
            beforeEach(() => {
                vm.histories = [
                    {units: 1, rate: 1, vcType: 'a', timestamp: 1},
                    {units: 1, rate: 1, vcType: 'BTC', timestamp: 1},
                    {units: 1, rate: 1, vcType: 'b', timestamp: 1},
                ];
                vm.conditions.coins = [];
            });

            it('filter only BASE coin when conditions.coins not exist', () => {
                expect(vm.listHistories.length).to.equal(2);
                expect(vm.listHistories[0].vcType).to.equal('a');
                expect(vm.listHistories[1].vcType).to.equal('b');
            });

            it('filter coins and BASE when conditions.coins exist', () => {
                vm.conditions.coins = ['B'];

                expect(vm.listHistories.length).to.equal(1);
                expect(vm.listHistories[0].vcType).to.equal('b');
            });
        });

        describe('listCoins', () => {
            beforeEach(() => {
                vm.histories = [
                    {units: 1, rate: 1, vcType: 'b', timestamp: 1},
                    {units: 1, rate: 1, vcType: 'a', timestamp: 1},
                    {units: 1, rate: 1, vcType: 'b', timestamp: 1},
                    {units: 1, rate: 1, vcType: 'a', timestamp: 1},
                ];
            });

            it('return coin names of histories', () => {
                expect(vm.listCoins.length).to.equal(2);
            });

            it('return list sorted by name', () => {
                expect(vm.listCoins[0]).to.equal('a');
                expect(vm.listCoins[1]).to.equal('b');
            });
        });
    });

    describe('methods', () => {
        describe('loadHistories', () => {
            it('set histories when it called', done => {
                vm.loadHistories();

                setTimeout(() => {
                    expect(vm.histories.length).to.equal(3);
                    done();
                }, 100);
            });
        });

        describe('onChangeCondition', () => {
            it('call axios get with condition date when type is date', () => {
                vm.onChangeCondition('date', '2018-01-01', '2018-02-01');

                expect(axios.get.calledWith(sinon.match.string, sinon.match({
                    params: {
                        start: moment('2018-01-01').valueOf(),
                        end: moment('2018-02-02').valueOf() - 1,
                    }
                }))).to.be.true;
            });

            it('set coins to data when type is coins', () => {
                vm.onChangeCondition('coins', ['a', 'b']);

                expect(vm.conditions.coins).to.deep.equal(['a', 'b']);
            });
        });
    });
});
