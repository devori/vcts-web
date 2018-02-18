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
                            data: data.map(({total}) => total),
                            fill: false,
                            borderColor: '#bce7d6',
                            backgroundColor: '#bce7d6',
                        },
                    ];
                }).catch(() => {});
            },
        },
    };
</script>
<style scoped lang="less">
</style>
