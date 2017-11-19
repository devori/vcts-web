<template>
  <v-card flat>
    <v-data-table
        :headers="headers"
        :items="listAssets"
        hide-actions
        class="elevation-1 text-xs-center"
      >
      <template slot="items" scope="props">
        <td class="text-xs-center">{{ props.item.vcType }}</td>
        <td class="text-xs-right">{{ props.item.total.toFixed(8) }}</td>
        <td :class="{'text-xs-right': true, 'red--text': props.item.change > 1, 'blue--text': props.item.change < 1 }">{{ props.item.ticker.toFixed(8) }}({{props.item.change}})</td>
        <td class="text-xs-right">{{ props.item.units.toFixed(8) }}</td>
      </template>
      <template slot="footer">
        <td colspan="100%" class="title">
          Total: {{ summary.total }}
        </td>
      </template>
    </v-data-table>
  </v-card>
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
    filters: {
    },
    computed: {
      bases () {
        return ['BTC']
      },
      headers () {
        return [
          { text: 'Coin', value: 'vcType' },
          { text: 'Estimated Value', value: 'total' },
          { text: 'Rate', value: 'rate' },
          { text: 'Units', value: 'units' }
        ]
      },
      summary () {
        let result = this.listAssets
        return result.reduce((sum, a) => {
          sum.total += a.total
          return sum
        }, { total: 0 })
      },
      listAssets () {
        let result = []
        for (let vcType in this.assets) {
          result.push(this.assets[vcType].reduce((acc, a) => {
            acc.total = acc.units * acc.rate + a.units * a.rate
            acc.units += a.units
            acc.rate = acc.total / acc.units
            return acc
          }, { vcType, units: 0, rate: 0 }))
        }
        result.forEach(a => {
          if (!this.tickers[a.vcType]) {
            a.change = 0.00
            a.ticker = 0.00
            return
          }
          a.ticker = this.tickers[a.vcType].bid
          a.change = a.ticker / a.rate
          a.change = Math.trunc(a.change * 100) / 100
          a.total = a.units * a.ticker
        })
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
