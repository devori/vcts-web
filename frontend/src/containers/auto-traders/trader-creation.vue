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
                    <v-text-field label="Min Trading"
                                  v-model="min"
                                  clearable
                                  type="number"
                                  required/>
                    <v-text-field label="Max Trading"
                                  v-model="max"
                                  clearable
                                  type="number"
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
                min: 1,
                max: 10,
            };
        },
        computed: {
            isOkDisabled () {
                const market = this.market.toLowerCase();
                const base = this.base.toUpperCase();
                const { min, max } = this;

                if (!market || !base || !min || !max) {
                    return true;
                }

                if (min > max) {
                    return true;
                }

                if (min <= 0) {
                    return true;
                }

                return this.traders.some(t => t.market === market && t.base === base);
            },
        },
        methods: {
            onClickOk () {
                const {market, base, min, max} = this;
                this.$emit('create', {market, base, min, max});
                this.showDialog = false;
            },
        },
    };
</script>
