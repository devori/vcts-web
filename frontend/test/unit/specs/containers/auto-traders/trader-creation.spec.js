import Vue from 'vue';
import Vuetify from 'vuetify';
import TraderCreation from '@/containers/auto-traders/trader-creation';

describe('containers/auto-traders/trader-creation', function () {
    let vm;

    beforeEach(() => {
        Vue.use(Vuetify);
        const Constructor = Vue.extend(TraderCreation);
        vm = new Constructor({
            propsData: {
                traders: [{market: 'market', base: 'BASE'}],
            },
        }).$mount();
        sinon.stub(vm, '$emit');
    });

    afterEach(() => {
        vm.$emit.restore();
    });

    describe('computed', () => {
        describe('isOkDisabled', () => {
            beforeEach(() => {
                vm.market = 'new-market';
                vm.base = 'NEW-BASE';
            });

            it('return false when market and base are valid', () => {
                expect(vm.isOkDisabled).to.be.false;
            });

            it('return true marketName is empty', () => {
                vm.market = '';
                expect(vm.isOkDisabled).to.be.true;
            });

            it('return true baseName is empty', () => {
                vm.base = '';
                expect(vm.isOkDisabled).to.be.true;
            });

            it('return true when marketName and baseName exist already', () => {
                vm.market = 'market';
                vm.base = 'base';
                expect(vm.isOkDisabled).to.be.true;
            });
        });
    });

    describe('methods', () => {
        describe('onClickOk', () => {
            beforeEach(() => {
                vm.market = 'market';
                vm.base = 'BASE';
            });

            it('should emit create event with market and base', () => {
                vm.onClickOk();
                expect(vm.$emit.calledWith('create', {market: 'market', base: 'BASE'})).to.be.true;
            });

            it('set false to showDialog', () => {
                vm.showDialog = true;
                vm.onClickOk();
                expect(vm.showDialog).to.be.false;
            });
        });
    });
});
