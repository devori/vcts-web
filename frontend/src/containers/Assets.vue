<template>
  <v-tabs light fixed centered v-model="active">
    <v-tabs-bar slot="activators" class="indigo">
      <v-tabs-slider class="yellow"></v-tabs-slider>
      <v-tabs-item
        v-for="(base, index) in bases"
        :key="index"
        :href="'#assets-tab-' + index"
      >
        {{ base }}
      </v-tabs-item>
    </v-tabs-bar>
    <v-tabs-content
      v-for="(base, index) in bases"
      :key="index"
      :id="'assets-tab-' + index"
    >
      <v-card flat>
        <v-data-table
            :headers="headers"
            :items="listAssets"
            hide-actions
            class="elevation-1 text-xs-center"
          >
          <template slot="items" scope="props">
            <td class="text-xs-center">{{ props.item.vcType }}</td>
            <td class="text-xs-right">{{ props.item.units.toFixed(8) }}</td>
            <td :class="{'text-xs-right': true, 'red--text': props.item.change > 1, 'blue--text': props.item.change < 1 }">{{ props.item.rate.toFixed(8) }}({{props.item.change}})</td>
            <td class="text-xs-right">{{ props.item.total.toFixed(8) }}</td>
          </template>
        </v-data-table>
      </v-card>
    </v-tabs-content>
  </v-tabs>
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
          { text: 'Units', value: 'units' },
          { text: 'Rate', value: 'rate' },
          { text: 'Estimated Value', value: 'total' }
        ]
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
        result.push(result.reduce((sum, a) => {
          sum.total += a.units * a.rate
          return sum
        }, { vcType: 'Summary', units: 0, rate: 0, total: 0 }))
        result.forEach(a => {
          if (!this.tickers[a.vcType]) {
            a.change = 0.00
            return
          }
          a.change = a.rate / this.tickers[a.vcType].bid
          a.change = Math.trunc(a.change * 100) / 100
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
