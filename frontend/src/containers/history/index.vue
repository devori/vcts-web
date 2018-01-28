<template>
    <v-layout>
        <v-flex xs12>
            <v-alert color='info' :value="true" class="subheading elevation-1">
                <div>
                    Total Profit: {{ totalProfit.toFixed(8) }}
                </div>
            </v-alert>
            <v-expansion-panel class="elevation-2">
                <v-expansion-panel-content>
                    <div slot="header">
                        <div>
                            <span>{{ conditions.startDate }} ~ {{ conditions.endDate }}</span>
                        </div>
                        <div>
                            <span>Coin: {{ conditions.coin ? conditions.coin : 'ALL' }}</span>
                        </div>
                    </div>
                    <v-card>
                        <v-card-text class="grey lighten-4">
                            <v-menu transition="slide-y-transition">
                                <v-text-field
                                    slot="activator"
                                    label="Start Date"
                                    v-model="conditions.startDate"
                                    prepend-icon="event"
                                    readonly
                                />
                                <v-date-picker v-model="conditions.startDate"
                                               no-title scrollable
                                               actions
                                               @input="onChangeDate"
                                >
                                </v-date-picker>
                            </v-menu>
                            <v-menu transition="slide-y-transition">
                                <v-text-field
                                    slot="activator"
                                    label="End Date"
                                    v-model="conditions.endDate"
                                    prepend-icon="event"
                                    readonly
                                />
                                <v-date-picker v-model="conditions.endDate"
                                               no-title
                                               scrollable
                                               actions
                                               @input="onChangeDate"
                                >
                                </v-date-picker>
                            </v-menu>
                            <v-flex xs10>
                                <v-text-field v-model="conditions.coin" placeholder="Coin"/>
                            </v-flex>
                        </v-card-text>
                    </v-card>
                </v-expansion-panel-content>
            </v-expansion-panel>
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

    export default {
        mounted () {
            this.loadHistories(this.bases[0]);
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
                    coin: '',
                },
            };
        },
        filters: {
        },
        computed: {
            market () {
                return this.$route.params.market;
            },
            bases () {
                return ['BTC'];
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
                return this.histories
                    .filter(({vcType}) => vcType !== this.bases[0])
                    .filter(({vcType}) => vcType.toUpperCase().indexOf(this.conditions.coin.toUpperCase()) >= 0);
            },
            totalProfit () {
                return this.listHistories.filter(({type}) => type === 'sell').reduce((sum, h) => {
                    return sum + (h.rate - h.buy) * h.units;
                }, 0);
            },
        },
        methods: {
            loadHistories () {
                return axios.get(`/private/markets/${this.market}/histories/${this.bases[0]}`, {
                    params: {
                        start: moment(this.conditions.startDate).valueOf(),
                        end: moment(this.conditions.endDate).add(1, 'days').valueOf() - 1,
                    },
                }).then(res => {
                    this.histories = res.data;
                }).catch(() => {});
            },
            onChangeDate () {
                this.loadHistories();
            },
        },
    };
</script>
<style scoped lang="less">
</style>
