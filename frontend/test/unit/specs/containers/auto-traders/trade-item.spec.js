import Vue from 'vue';
import Vuetify from 'vuetify';
import TraderItem from '@/containers/auto-traders/trade-item';

describe('containers/auto-traders/trade-item', function () {
    let vm;

    beforeEach(() => {
        Vue.use(Vuetify);
        const Constructor = Vue.extend(TraderItem);
        vm = new Constructor({
            propsData: {
                item: {
                    name: 'ETH',
                    purchase: { inUse: false },
                    sale: { inUse: false },
                },
                disabled: false,
            },
        }).$mount();
        sinon.stub(vm, '$emit');
    });

    afterEach(() => {
        vm.$emit.restore();
    });

    describe('computed', () => {
    });

    describe('methods', () => {
        describe('onClickDelete', () => {
            it('should emit onDelete with name', () => {
                vm.onClickClose();
                expect(vm.$emit.calledWith('close')).to.be.true;
            });
        });

        describe('onChangePurchase', () => {
            it('should emit onChange with changed info', () => {
                vm.onChangePurchase(true);
                expect(vm.$emit.calledWith('change', {
                    name: 'ETH',
                    purchase: { inUse: true },
                    sale: { inUse: false },
                })).to.be.true;
            });
        });

        describe('onChangeSale', () => {
            it('should emit onChange with changed info', () => {
                vm.onChangeSale(true);
                expect(vm.$emit.calledWith('change', {
                    name: 'ETH',
                    purchase: { inUse: false },
                    sale: { inUse: true },
                })).to.be.true;
            });
        });
    });
});
