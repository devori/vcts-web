<template>
    <v-container grid-list-lg>
        <v-layout row wrap>
            <v-flex xs12 sm12 md12 lg12 v-for="(info, key) in traders" :key="key">
                <v-card class="blue lighten-3">
                    <v-card-title primary-title>
                        <div class="trader-title">
                            <div class="headline">
                                {{ toUpperCaseFirst(info.market) }} [{{ info.base }}]
                            </div>
                            <div class="trader-title__onoff">
                                <v-switch
                                    :hide-details="true"
                                    :label="info.isRunning ? 'running' : 'stop'"
                                    v-model="info.isRunning"
                                    @change="onChangeTraderStatus(info.market, info.base)"/>
                            </div>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-slider prepend-icon="exposure_plus_1"
                                  :disabled="info.isRunning"
                                  :hint="`Buy : -${Math.trunc(info.rule.options.rateForPurchase * 100)} %`"
                                  :persistent-hint="true"
                                  :step="0.01"
                                  :min="0.01"
                                  :max="0.30"
                                  @input="(rate) => onChangeRate(info.market, info.base, rate, info.rule.options.rateForSale)"
                                  v-model="info.rule.options.rateForPurchase"/>
                        <v-slider prepend-icon="exposure_neg_1"
                                  :disabled="info.isRunning"
                                  :hint="`Sell : ${Math.trunc(info.rule.options.rateForSale * 100)} %`"
                                  :persistent-hint="true"
                                  :step="0.01"
                                  :min="0.01"
                                  :max="0.30"
                                  @input="(rate) => onChangeRate(info.market, info.base, info.rule.options.rateForPurchase, rate)"
                                  v-model="info.rule.options.rateForSale"/>
                        <v-slider prepend-icon="attach_money"
                                  :disabled="info.isRunning"
                                  :hint="`Min - ${info.minUnits} ${info.base}`"
                                  :persistent-hint="true"
                                  :step="info.unitRange[0]"
                                  :min="info.unitRange[0]"
                                  :max="info.unitRange[1]"
                                  @input="(units) => onChangeUnits(info.market, info.base, units, info.maxUnits)"
                                  v-model="info.minUnits"/>
                        <v-slider prepend-icon="attach_money"
                                  :disabled="info.isRunning"
                                  :hint="`Max - ${info.maxUnits} ${info.base}`"
                                  :persistent-hint="true"
                                  :step="info.unitRange[0]"
                                  :min="info.unitRange[0]"
                                  :max="info.unitRange[1]"
                                  @input="(units) => onChangeUnits(info.market, info.base, info.minUnits, units)"
                                  v-model="info.maxUnits"/>
                        <v-slider prepend-icon="alarm"
                                  :disabled="info.isRunning"
                                  :hint="info.interval + ' Sec'"
                                  :persistent-hint="true"
                                  :step="10"
                                  :min="10"
                                  :max="300"
                                  v-model="info.interval"/>
                    </v-card-text>
                    <v-card-actions class="justify-center">
                        <div>Coin Setting ({{ info.coins.length }})</div>
                        <v-btn icon @click.native="info.showDetails = !info.showDetails">
                            <v-icon>{{ info.showDetails ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
                        </v-btn>
                    </v-card-actions>
                    <v-slide-y-transition>
                        <v-card-text v-show="info.showDetails">
                            <v-layout row wrap>
                                <v-flex xs6 sm4 md3 lg2 v-for="(coin, key) in info.coins" :key="key">
                                    <TradeItem :name="coin.name"
                                               :disabled="info.isRunning"
                                               :item="coin"
                                               :isError="!isAvailableCoin(info.market, info.base, coin.name)"
                                               @change="(changedItem) => onChangeTradeItem(info.market, info.base, changedItem)"
                                               @close="onRemoveTradeItem(info.market, info.base, coin.name)"
                                    />
                                </v-flex>
                            </v-layout>
                            <v-text-field :label="getHintToAddCoins(info.market, info.base, info.coins)"
                                          :disabled="info.isRunning"
                                          clearable
                                          v-model="coinName"
                                          @keyup.enter="() => addCoin(info.market, info.base)"
                            />
                        </v-card-text>
                    </v-slide-y-transition>
                </v-card>
            </v-flex>
            <trader-creation :traders="traders" @create="onCreateTrader"/>
        </v-layout>
    </v-container>
</template>
<script>
    import axios from 'axios';
    import TradeItem from './trade-item';
    import TraderCreation from './trader-creation';
    import { getTickersByBase } from '../../apis';

    export default {
        components: {
            TraderCreation,
            TradeItem,
        },
        mounted () {
            this.loadAutoTraders();
        },
        data () {
            return {
                traders: [],
                coinName: '',
                showAddDialog: false,
                marketName: '',
                baseName: '',
                availableCoins: {},
            };
        },
        methods: {
            loadAutoTraders () {
                axios.get(`/private/auto-traders`).then(res => {
                    this.traders = res.data.map(t => {
                        t.interval /= 1000;
                        t.showDetails = false;
                        t.coins.sort((c1, c2) => c1.name < c2.name ? -1 : 1);
                        t.rule = t.rule || {
                            name: 'default',
                            options: {
                                rateForPurchase: 0.07,
                                rateForSale: 0.07,
                            },
                        };
                        return t;
                    });
                }).then(() => {
                    this.traders.forEach(async ({ market, base }) => {
                        const tickers = await getTickersByBase(market, base);
                        this.availableCoins[market] = this.availableCoins || {};
                        this.availableCoins[base] = Object.keys(tickers);
                    });
                }).catch(() => {});
            },
            getHintToAddCoins (market, base, addedCoins) {
                if (!this.availableCoins[market] || !this.availableCoins[market][base]) {
                    return '';
                }
                const addedCoinNames = addedCoins.map(({ name }) => name);
                const hintCoins = this.availableCoins[market][base].filter(n => !addedCoinNames.includes(n));
                return `Add Coin Name (${hintCoins.join(', ').substr(0, 30)})`;
            },
            isAvailableCoin (market, base, coinName) {
                return this.availableCoins[market] && this.availableCoins[market][base] && this.availableCoins[market][base].includes(coinName);
            },
            getTrader (market, base) {
                return this.traders.find(t => t.market === market && t.base === base);
            },
            startAutoTrader (market, base) {
                const {interval, minUnits, maxUnits, coins, rule, unitRange} = this.getTrader(market, base);
                axios.post(`/private/auto-traders/${market}/${base}`, {
                    interval: interval * 1000,
                    minUnits,
                    maxUnits,
                    coins,
                    rule,
                    unitRange,
                }).finally(() => {
                    return this.loadAutoTraders();
                }).catch(() => {});
            },
            stopAutoTrader (market, base) {
                axios.delete(`/private/auto-traders/${market}/${base}`).finally(() => {
                    return this.loadAutoTraders();
                }).catch(() => {});
            },
            onChangeTraderStatus (market, base) {
                const trader = this.getTrader(market, base);
                if (trader.isRunning) {
                    this.startAutoTrader(market, base);
                } else {
                    this.stopAutoTrader(market, base);
                }
            },
            toUpperCaseFirst (str) {
                if (!str) {
                    return str;
                }
                return str.substr(0, 1).toUpperCase() + str.substr(1);
            },
            onChangeUnits (market, base, minUnits, maxUnits) {
                const trader = this.getTrader(market, base);
                if (maxUnits < 0.002) {
                    maxUnits = 0.002;
                }
                if (minUnits >= maxUnits) {
                    minUnits = maxUnits - 0.001;
                }
                trader.minUnits = minUnits;
                trader.maxUnits = maxUnits;
            },
            onChangeRate (market, base, rateForPurchase, rateForSale) {
                const trader = this.getTrader(market, base);
                trader.rule.options = {
                    rateForPurchase,
                    rateForSale,
                };
            },
            addCoin (market, base) {
                const name = this.coinName.toUpperCase();
                if (!this.availableCoins[base].includes(name)) {
                    return;
                }
                const trader = this.getTrader(market, base);
                if (trader.coins.some(coin => coin.name === name)) {
                    return;
                }
                trader.coins.push({
                    name,
                    purchase: { inUse: true },
                    sale: { inUse: true },
                });

                this.coinName = '';
            },
            onRemoveTradeItem (market, base, name) {
                const trader = this.getTrader(market, base);
                const index = trader.coins.findIndex(coin => coin.name === name);
                trader.coins.splice(index, 1);
            },
            onChangeTradeItem (market, base, changedItem) {
                const trader = this.getTrader(market, base);
                const coin = trader.coins.find(coin => coin.name === changedItem.name);
                Object.assign(coin, changedItem);
            },
            onCreateTrader (newTrader) {
                const market = newTrader.market.toLowerCase();
                const base = newTrader.base.toUpperCase();
                const { min, max } = newTrader;
                this.traders.push({
                    market,
                    base,
                    interval: 300000,
                    unitRange: [min, max],
                    minUnits: min,
                    maxUnits: max,
                    coins: [],
                    showDetails: false,
                    rule: {
                        name: 'default',
                        options: {
                            rateForPurchase: 0.07,
                            rateForSale: 0.07,
                        },
                    },
                });
            },
        },
    };
</script>
<style scoped lang="less">
    .trader-title {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .trader-title__onoff {
        width: 100px;
    }
</style>
