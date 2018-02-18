import Vue from 'vue';
import Vuetify from 'vuetify';
import AutoTraders from '@/containers/auto-traders';

describe('containers/auto-traders', function () {
    const MARKET = 'market';
    const BASE = 'BASE';

    let vm;

    beforeEach(() => {
        Vue.use(Vuetify);
        const Constructor = Vue.extend(AutoTraders);
        vm = new Constructor({}).$mount();
    });

    afterEach(() => {
    });

    describe('computed', () => {
    });

    describe('methods', () => {
        describe('onCreateTrader', () => {
            it('create trader with default values', () => {
                vm.onCreateTrader({market: MARKET, base: BASE});
                expect(vm.traders.length).to.equal(1);
                expect(vm.traders[0]).to.deep.equal({
                    market: MARKET,
                    base: BASE,
                    interval: 300000,
                    minUnits: 0.002,
                    maxUnits: 0.01,
                    coins: [],
                    showDetails: false,
                    rule: {
                        name: 'default',
                        options: {
                            rateForPurchase: 0.07,
                            rateForSale: 0.07,
                        },
                    },
                });
            });
        });
    });
});
