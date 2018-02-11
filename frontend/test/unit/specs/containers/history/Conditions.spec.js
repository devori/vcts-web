import Vue from 'vue';
import Vuetify from 'vuetify';
import sinon from 'sinon';
import Conditions from '@/containers/history/Conditions';

describe('containers/history/Conditions', function () {
    let vm;

    beforeEach(() => {
        Vue.use(Vuetify);
        const Constructor = Vue.extend(Conditions);
        vm = new Constructor().$mount();

        sinon.stub(vm, '$emit');

        vm.startDate = '2018-01-01';
        vm.endDate = '2018-02-01';
        vm.selectedCoins = ['A', 'B', 'C'];
    });

    afterEach(() => {
        vm.$emit.restore();
    });

    describe('methods', () => {
        describe('onChangeDate', () => {
            it('emit change with start and end', () => {
                vm.onChangeDate();

                expect(vm.$emit.calledWith('change', 'date', '2018-01-01', '2018-02-01')).to.be.true;
            });
        });

        describe('onChangeCoins', () => {
            it('emit change with coins', () => {
                vm.onChangeCoins();

                expect(vm.$emit.calledWith('change', 'coins', vm.selectedCoins.slice(0))).to.be.true;
            });
        });

        describe('onRemoveCoin', () => {
            it('remove coin at coins', () => {
                vm.onRemoveCoin('B');

                expect(vm.selectedCoins).to.deep.equal(['A', 'C'])
            });

            it('emit changeCoins with coins', () => {
                vm.onRemoveCoin('B');

                expect(vm.$emit.calledWith('change', 'coins', ['A', 'C'])).to.be.true;
            })
        });
    });
});
