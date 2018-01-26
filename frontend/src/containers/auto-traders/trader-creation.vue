<template>
    <v-flex>
        <v-btn block class="blue lighten-2"
               @click="showDialog = true"
        >
            Add Trader
        </v-btn>
        <v-dialog v-model="showDialog" max-width="300px">
            <v-card>
                <v-card-title>
                    Add Trader
                </v-card-title>
                <v-card-text>
                    <v-text-field label="Market Name"
                                  v-model="market"
                                  clearable
                                  required/>
                    <v-text-field label="Base Name"
                                  v-model="base"
                                  clearable
                                  required/>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary"
                           :disabled="isOkDisabled"
                           block
                           flat
                           @click.stop="onClickOk">OK
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-flex>
</template>

<script>
    export default {
        props: {
            traders: {
                type: Array,
                default: [],
            },
        },
        data () {
            return {
                showDialog: false,
                market: '',
                base: '',
            };
        },
        computed: {
            isOkDisabled () {
                const market = this.market.toLowerCase();
                const base = this.base.toUpperCase();

                if (!market || !base) {
                    return true;
                }

                return this.traders.some(t => t.market === market && t.base === base);
            },
        },
        methods: {
            onClickOk () {
                const {market, base} = this;
                this.$emit('create', {market, base});
                this.showDialog = false;
            },
        },
    };
</script>
