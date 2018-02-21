<template>
    <v-container grid-list-lg>
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
            loadAssetsSummary (market, base) {
                const timestamp = new Date().getTime();
                axios.get(`/private/analysis/assets/${market}/${base}`, {
                    params: {
                        summary: true,
                        start: timestamp - 1000 * 60 * 60 * 24 * 7,
                        end: timestamp,
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
                            borderColor: '#bce7d6',
                            backgroundColor: '#bce7d6',
                        },
                        {
                            label: 'USDT Balance(10,000$)',
                            data: data.map(({units, rate}) => units * rate.usdt / 10000),
                            fill: false,
                            borderColor: '#d66ff1',
                            backgroundColor: '#d66ff1',
                        },
                    ];
                }).catch(() => {});
            },
        },
    };
</script>
<style scoped lang="less">
</style>
