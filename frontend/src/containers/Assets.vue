<template>
    <v-layout>
        <v-flex xs12>
            <v-alert color="info" :value="true" class="headline">
                Total - {{ totalSummary.estimation.toFixed(8) }} ({{ (totalSummary.estimation / totalSummary.principal).toFixed(2) }})
            </v-alert>
            <v-toolbar light>
                <v-btn-toggle mandatory v-model="sort.target">
                    <v-btn value="estimation">Estimation</v-btn>
                    <v-btn value="vcType">Name</v-btn>
                </v-btn-toggle>
                <v-spacer></v-spacer>
                <v-btn-toggle mandatory v-model="sort.direction">
                    <v-btn value="asc">ASC</v-btn>
                    <v-btn value="desc">DESC</v-btn>
                </v-btn-toggle>
            </v-toolbar>
            <v-list :two-line="true">
                <v-list-group v-for="summary in listSortedSummaries" :value="summary.vcType" :key="summary.vcType"
                              class="elevation-1">
                    <v-list-tile slot="item" @click="onClickSummary(summary.vcType)">
                        <v-list-tile-action>
                            {{ summary.vcType }}
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>
                                <span>{{ summary.estimation.toFixed(8) }}</span>
                                <span
                                    :class="{'text-xs-right': true, 'red--text': summary.change > 1, 'blue--text': summary.change < 1 }">({{ summary.change.toFixed(2) }})</span>
                            </v-list-tile-title>
                            <v-list-tile-sub-title>
                                Bid - {{ summary.ticker.toFixed(8) }}
                            </v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-action v-if="summary.assets.length > 0">
                            <div class="badge">
                                <v-badge v-show="countMoreThan1(summary.assets) > 0" color="red" left>
                                    <span slot="badge">{{ countMoreThan1(summary.assets) }}</span>
                                </v-badge>
                                <v-badge>
                                    <span slot="badge">{{ countLessThan1(summary.assets) }}</span>
                                </v-badge>
                            </div>
                        </v-list-tile-action>
                    </v-list-tile>
                    <v-list-tile v-if="selectedAssets.vcType === summary.vcType" v-for="asset in summary.assets" :key="asset.uuid"
                                 @click="onClickAsset(summary.vcType, asset.uuid)">
                        <v-list-tile-action>
                            <v-checkbox
                                :input-value="selectedAssets.ids.find(uuid => uuid === asset.uuid)"></v-checkbox>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>
                                <span class="text-xs-right">{{ asset.estimation.toFixed(8) }}</span>
                                <span
                                    :class="{'text-xs-right': true, 'red--text': asset.change > 1, 'blue--text': asset.change < 1 }">({{ asset.change.toFixed(2) }})</span>
                            </v-list-tile-title>
                            <v-list-tile-sub-title>
                                {{ asset.rate.toFixed(8) }} - {{ asset.units.toFixed(8) }}
                            </v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list-group>
            </v-list>
        </v-flex>
        <v-snackbar
            :timeout="300000"
            color="red lighten-1"
            :value="showControlBox"
        >
            <v-btn dark flat :disabled="selectedAssets.ids.length <= 1" @click="onClickMerge">
                <v-icon>call_merge</v-icon>
                <span>Merge</span>
            </v-btn>
            <v-btn dark flat @click="onClickRemove">
                <v-icon>delete</v-icon>
                <span>Remove</span>
            </v-btn>
            <v-btn dark flat @click="onClickSell">
                <v-icon>wrap_text</v-icon>
                <span>Sell</span>
            </v-btn>
        </v-snackbar>
    </v-layout>
</template>
<script>
    import axios from 'axios';

    export default {
        mounted () {
            this.loadTickersByBase();
            this.loadAssetsByBase();
        },
        data () {
            return {
                assets: {},
                tickers: {},
                active: '',
                sort: {
                    target: 'estimation',
                    direction: 'desc',
                },
                selectedAssets: {
                    vcType: '',
                    ids: [],
                },
            };
        },
        computed: {
            market () {
                return this.$route.params.market;
            },
            base () {
                return this.market === 'upbit' ? 'WON' : 'USDT';
            },
            totalSummary () {
                const estimation = this.listSummaries.reduce((acc, s) => acc + s.estimation, 0);
                const principal = this.listSummaries
                    .filter(s => !isNaN(s.units) && !isNaN(s.rate))
                    .reduce((acc, s) => acc + s.units * s.rate, 0);
                return {
                    estimation,
                    principal,
                };
            },
            listSortedSummaries () {
                let result = this.listSummaries.slice(0);
                result.sort((s1, s2) => {
                    let b = 0;
                    if (s1[this.sort.target] < s2[this.sort.target]) {
                        b = -1;
                    } else if (s1[this.sort.target] > s2[this.sort.target]) {
                        b = 1;
                    }
                    return b * (this.sort.direction === 'asc' ? 1 : -1);
                });
                return result;
            },
            listSummaries () {
                let result = [];
                for (let vcType in this.assets) {
                    let arr = this.assets[vcType];
                    let ticker = (this.tickers[vcType] && this.tickers[vcType].bid) || 0;
                    let summary = {
                        vcType,
                        ticker,
                        estimation: arr.reduce((acc, a) => acc + a.units * ticker, 0),
                        units: arr.reduce((acc, a) => acc + a.units, 0),
                        rate: arr.reduce((acc, a) => acc + a.rate * a.units, 0) / arr.reduce((acc, a) => acc + a.units, 0),
                        assets: arr.map(a => ({
                            uuid: a.uuid,
                            estimation: a.units * ticker,
                            change: ticker / a.rate,
                            rate: a.rate,
                            units: a.units,
                        })),
                    };
                    summary.change = ticker / summary.rate;
                    result.push(summary);
                }

                return result;
            },
            showControlBox () {
                return this.selectedAssets.ids.length > 0;
            },
        },
        methods: {
            loadAssetsByBase () {
                return axios.get(`/private/markets/${this.market}/assets/${this.base}`).then(res => {
                    this.assets = res.data;
                }).catch(() => {
                });
            },
            loadTickersByBase () {
                return axios.get(`/private/markets/${this.market}/tickers/${this.base}`).then(res => {
                    this.tickers = res.data;
                    this.tickers[this.base] = {bid: 1};
                }).catch(() => {
                });
            },
            onClickAsset (vcType, id) {
                if (this.selectedAssets.vcType === vcType) {
                    if (this.selectedAssets.ids.find(aid => aid === id)) {
                        this.selectedAssets.ids = this.selectedAssets.ids.filter(aid => aid !== id);
                    } else {
                        this.selectedAssets.ids = [...this.selectedAssets.ids, id];
                    }
                } else {
                    this.selectedAssets = {
                        vcType,
                        ids: [id],
                    };
                }
            },
            onClickSummary (vcType) {
                if (this.selectedAssets.vcType === vcType) {
                    return;
                }
                this.selectedAssets = {
                    vcType,
                    ids: [],
                };
            },
            onClickRemove () {
                const {vcType, ids} = this.selectedAssets;
                ids.reduce((prom, id) => {
                    return prom.then(() => {
                        return axios.delete(`/private/markets/${this.market}/assets/${this.base}/${vcType}/${id}`);
                    });
                }, Promise.resolve()).then(() => {
                    return this.loadAssetsByBase();
                }).then(() => {
                    this.selectedAssets = {
                        vcType: '',
                        ids: [],
                    };
                });
            },
            onClickMerge () {
                const {vcType, ids} = this.selectedAssets;
                axios.put(`/private/markets/${this.market}/assets/${this.base}/${vcType}?mode=merge`, {ids}).then(() => {
                    return this.loadAssetsByBase();
                }).then(() => {
                    this.selectedAssets = {
                        vcType: '',
                        ids: [],
                    };
                }).catch(() => {
                });
            },
            onClickSell () {
                const {vcType, ids} = this.selectedAssets;
                const rate = this.tickers[vcType].bid;
                const units = this.assets[vcType].filter(a => {
                    return ids.some(id => id === a.uuid);
                }).reduce((sum, a) => sum + a.units, 0);

                axios.post(`/private/markets/${this.market}/order`, {
                    side: 'sell',
                    base: this.base,
                    vcType,
                    ids,
                    units,
                    rate,
                }).then(() => {
                    return this.loadAssetsByBase(this.base);
                }).then(() => {
                    this.selectedAssets = {
                        vcType: '',
                        ids: [],
                    };
                }).catch(() => {
                });
            },
            countMoreThan1 (assets) {
                return assets.reduce((sum, a) => {
                    sum += a.change > 1 ? 1 : 0;
                    return sum;
                }, 0);
            },
            countLessThan1 (assets) {
                return assets.reduce((sum, a) => {
                    sum += a.change <= 1 ? 1 : 0;
                    return sum;
                }, 0);
            },
        },
    };
</script>
<style scoped lang="less">
    .badge {
        margin-right: 10px;
    }
</style>
