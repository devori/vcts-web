<template>
  <v-layout>
    <v-flex xs12>
      <v-alert color="info" :value="true" class="headline">
        Total - {{ totalEstimation.toFixed(8) }}
      </v-alert>
      <v-list :two-line="true">
        <v-list-group v-for="summary in listSummaries" :value="summary.vcType" :key="summary.vcType" class="elevation-1">
          <v-list-tile slot="item" @click="">
            <v-list-tile-action>
              {{ summary.vcType }}
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                <span>{{ summary.estimation.toFixed(8) }}</span>
                <span :class="{'text-xs-right': true, 'red--text': summary.change > 1, 'blue--text': summary.change < 1 }">({{ summary.change.toFixed(2) }})</span>
              </v-list-tile-title>
              <v-list-tile-sub-title>
                Bid - {{ summary.ticker.toFixed(8) }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action v-if="summary.assets.length > 0">
              <v-badge left>
                <span slot="badge">{{ summary.assets.length }}</span>
              </v-badge>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile v-for="asset in summary.assets" :key="asset.uuid" @click="">
            <v-list-tile-content>
              <v-list-tile-title>
                <span class="text-xs-right">{{ asset.estimation.toFixed(8) }}</span>
                <span :class="{'text-xs-right': true, 'red--text': asset.change > 1, 'blue--text': asset.change < 1 }">({{ asset.change.toFixed(2) }})</span>
              </v-list-tile-title>
              <v-list-tile-sub-title>
                {{ asset.rate.toFixed(8) }} - {{ asset.units.toFixed(8) }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-flex>
  </v-layout>
</template>
<script>
  import axios from 'axios'
  export default {
    mounted () {
      this.loadAssetsByBase(this.bases[0])
      this.loadTickersByBase(this.bases[0])
    },
    data () {
      return {
        assets: [],
        tickers: {},
        active: ''
      }
    },
    computed: {
      bases () {
        return ['BTC']
      },
      totalEstimation () {
        return this.listSummaries.reduce((acc, s) => acc + s.estimation, 0)
      },
      listSummaries () {
        let result = []
        for (let vcType in this.assets) {
          let arr = this.assets[vcType]
          let ticker = (this.tickers[vcType] && this.tickers[vcType].bid) || 0
          let summary = {
            vcType,
            ticker,
            estimation: arr.reduce((acc, a) => acc + a.units * ticker, 0),
            units: arr.reduce((acc, a) => acc + a.units, 0),
            rate: arr.reduce((acc, a) => acc + a.rate * a.units, 0) / arr.reduce((acc, a) => acc + a.units, 0),
            assets: arr.map(a => ({
              estimation: a.units * ticker,
              change: ticker / a.rate,
              rate: a.rate,
              units: a.units
            }))
          }
          summary.change = ticker / summary.rate
          result.push(summary)
        }
        return result
      }
    },
    methods: {
      loadAssetsByBase (base) {
        axios.get(`/private/markets/poloniex/assets/${base}`).then(res => {
          this.assets = res.data
        }).catch(() => {})
      },
      loadTickersByBase (base) {
        axios.get(`/private/markets/poloniex/tickers/${base}`).then(res => {
          this.tickers = res.data
        }).catch(() => {})
      }
    }
  }
</script>
<style scoped lang="less">
</style>
