<template>
    <v-layout>
        <v-flex xs12>
            <v-alert color='info' :value="true" class="subheading elevation-1">
                <div>
                    Total Profit: {{ totalProfit.toFixed(8) }}
                </div>
            </v-alert>
            <Conditions :coins="listCoins" @change="onChangeCondition"/>
            <br/>
            <v-data-table
                :headers="headers"
                :items="listHistories"
                :pagination.sync="pagination"
                class="elevation-1 text-xs-center"
            >
                <template slot="items" slot-scope="props">
                    <td class="text-xs-center">{{ props.item.vcType }} ({{ props.item.type }})</td>
                    <td class="text-xs-center">{{ new Date(props.item.timestamp).toLocaleString() }}</td>
                    <td class="text-xs-right">{{ (props.item.units * props.item.rate).toFixed(8) }}</td>
                    <td class="text-xs-right">{{ props.item.units.toFixed(8) }}</td>
                    <td v-if="props.item.type !== 'sell'" class="text-xs-right">{{ props.item.rate.toFixed(8) }}</td>
                    <td v-if="props.item.type === 'sell'" class="text-xs-right">{{ props.item.rate.toFixed(8) }}({{
                        (props.item.buy || props.item.rate).toFixed(8) }})
                    </td>
                </template>
            </v-data-table>
        </v-flex>
    </v-layout>
</template>
<script>
    import axios from 'axios';
    import moment from 'moment';
    import Conditions from './Conditions';

    export default {
        components: {
            Conditions,
        },
        mounted () {
            this.loadHistories();
        },
        data () {
            const today = moment().format('YYYY-MM-DD');
            return {
                histories: [],
                active: '',
                pagination: {
                    sortBy: 'timestamp',
                    descending: true,
                    rowsPerPage: 25,
                },
                conditions: {
                    startDate: today,
                    endDate: today,
                    coins: [],
                },
            };
        },
        filters: {
        },
        computed: {
            market () {
                return this.$route.params.market;
            },
            base () {
                return this.market === 'upbit' ? 'WON' : 'USDT';
            },
            headers () {
                return [
                    {text: 'Coin', value: 'vcType'},
                    {text: 'Datetime', value: 'timestamp'},
                    {text: 'Estimation', value: 'total'},
                    {text: 'Units', value: 'units'},
                    {text: 'Rate', value: 'rate'},
                ];
            },
            listHistories () {
                const coins = this.conditions.coins.map(c => c.toUpperCase());

                return this.histories
                    .filter(({vcType}) => vcType.toUpperCase() !== this.base)
                    .filter(({vcType}) => coins.length === 0 || coins.indexOf(vcType.toUpperCase()) >= 0);
            },
            totalProfit () {
                return this.listHistories.filter(({type, buy}) => type === 'sell' && buy !== undefined).reduce((sum, h) => {
                    return sum + (h.rate - h.buy) * h.units;
                }, 0);
            },
            listCoins () {
                const namesMap = this.histories.filter(({vcType}) => vcType.toUpperCase() !== this.base)
                    .reduce((accum, {vcType}) => {
                        accum[vcType] = true;
                        return accum;
                    }, {});

                const names = Object.keys(namesMap);

                names.sort((n1, n2) => {
                    if (n1 < n2) {
                        return -1;
                    } else if (n1 > n2) {
                        return 1;
                    }
                    return 0;
                });

                return names;
            },
        },
        methods: {
            loadHistories () {
                return axios.get(`/private/markets/${this.market}/histories/${this.base}`, {
                    params: {
                        start: moment(this.conditions.startDate).valueOf(),
                        end: moment(this.conditions.endDate).add(1, 'days').valueOf() - 1,
                    },
                }).then(res => {
                    this.histories = res.data;
                }).catch(() => {});
            },
            onChangeCondition (type, ...values) {
                if (type === 'date') {
                    this.conditions.startDate = values[0];
                    this.conditions.endDate = values[1];
                    this.loadHistories();
                } else if (type === 'coins') {
                    this.conditions.coins = values[0];
                }
            },
        },
    };
</script>
<style scoped lang="less">
</style>
