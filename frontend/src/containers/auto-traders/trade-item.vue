<template>
    <v-card :class="['lighten-4', (isError ? 'red' : 'blue')]">
        <v-card-title class="justify-space-between">
            <div class="title">{{ item.name }}</div>
            <v-btn icon
                   flat
                   :disabled="disabled"
                   @click="onClickClose"
            >
                <v-icon blue>close</v-icon>
            </v-btn>
        </v-card-title>
        <v-card-text>
            <v-checkbox :disabled="disabled"
                        label="Purchase"
                        :inputValue="item.purchase.inUse"
                        @change="onChangePurchase"
            />
            <v-checkbox :disabled="disabled"
                        label="Sale"
                        :inputValue="item.sale.inUse"
                        @change="onChangeSale"
            />
        </v-card-text>
    </v-card>
</template>

<script>
    export default {
        name: 'trade-item',
        props: {
            item: {
                type: Object,
                default: {
                    name: '',
                    purchase: { inUse: true },
                    sale: { inUse: true },
                },
            },
            disabled: {
                type: Boolean,
                default: false,
            },
            isError: {
                type: Boolean,
                default: false,
            },
        },
        methods: {
            onClickClose () {
                this.$emit('close', this.name);
            },
            onChangePurchase (purchase) {
                this.$emit('change', Object.assign({}, this.item, { purchase: { inUse: purchase } }));
            },
            onChangeSale (sale) {
                this.$emit('change', Object.assign({}, this.item, { sale: { inUse: sale } }));
            },
        },
    };
</script>

<style scoped>
</style>
