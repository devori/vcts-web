import Vue from 'vue';
import Vuetify from 'vuetify';
import axios from 'axios';
import sinon from 'sinon';
import Analysis from '@/containers/analysis';

describe('containers/analysis', function () {
    const MARKET = 'market';
    const BASE = 'BASE';

    let vm;

    beforeEach(() => {
        sinon.stub(axios, 'get').resolves({data: [{timestamp: 1, units: 1, rate: {usdt: 1}}]});

        Vue.use(Vuetify);
        const Constructor = Vue.extend(Analysis);
        vm = new Constructor({}).$mount();
    });

    afterEach(() => {
        axios.get.restore();
    });

    describe('computed', () => {
    });

    describe('methods', () => {
        describe('loadAssetsSummary', () => {
            it('set summary data to data', done => {
                vm.loadAssetsSummary(MARKET, BASE);

                setTimeout(() => {
                    expect(vm.chartData.labels.length).to.equal(1);
                    expect(vm.chartData.datasets.length).to.equal(3);
                    expect(vm.chartData.datasets[0].data.length).to.equal(1);
                    expect(vm.chartData.datasets[0].data[0]).to.equal(1);
                    done();
                }, 100);
            });
        });
    });
});
