<template>
    <v-container grid-list-lg>
        <div class="condition">
            <v-menu transition="slide-y-transition">
                <v-text-field
                    slot="activator"
                    label="Start Date"
                    v-model="startDate"
                    prepend-icon="event"
                    readonly
                />
                <v-date-picker v-model="startDate"
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
                    v-model="endDate"
                    prepend-icon="event"
                    readonly
                />
                <v-date-picker v-model="endDate"
                               no-title
                               scrollable
                               actions
                               @input="onChangeDate"
                >
                </v-date-picker>
            </v-menu>
        </div>
        <v-layout row wrap>
            <vue-chart type="line" :data="chartData"
                       :options="options"
            />
        </v-layout>
    </v-container>
</template>
<script>
    import axios from 'axios';
    import moment from 'moment';
    import VueChart from 'vue-chart-js';

    export default {
        components: {
            VueChart,
        },
        mounted () {
            this.loadAssetsSummary('binance', 'BTC');
        },
        data () {
            return {
                startDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),
                endDate: moment().format('YYYY-MM-DD'),
                chartData: {
                    labels: [],
                    datasets: [],
                },
                options: {
                    color: ['red'],
                },
            };
        },
        methods: {
            onChangeDate () {
                this.loadAssetsSummary('binance', 'BTC');
            },
            loadAssetsSummary (market, base) {
                axios.get(`/private/analysis/assets/${market}/${base}`, {
                    params: {
                        summary: true,
                        start: moment(this.startDate).valueOf(),
                        end: moment(this.endDate).add(1, 'days').valueOf(),
                    },
                }).then(res => {
                    const data = res.data;
                    data.sort((d1, d2) => d1.timestamp - d2.timestamp);
                    this.chartData.labels = data.map(({timestamp}) => moment(timestamp).format('YYYY-MM-DD HH:mm'));
                    this.chartData.datasets = [
                        {
                            label: 'Base Balance',
                            data: data.map(({units}) => units),
                            fill: false,
                            borderColor: '#14A9C5',
                            backgroundColor: '#14A9C5',
                        },
                        {
                            label: 'Base Rate(10,000$)',
                            data: data.map(({rate}) => rate.usdt / 10000),
                            fill: false,
                            borderColor: '#FBAD40',
                            backgroundColor: '#FBAD40',
                        },
                        {
                            label: 'USDT Balance(10,000$)',
                            data: data.map(({units, rate}) => units * rate.usdt / 10000),
                            fill: false,
                            borderColor: '#72CD22',
                            backgroundColor: '#72CD22',
                        },
                    ];
                }).catch(() => {});
            },
        },
    };
</script>
<style scoped lang="less">
    .condition {
        padding-left: 30px;
    }
</style>
