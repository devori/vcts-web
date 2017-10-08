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
            <td class="text-xs-right">{{ props.item.rate.toFixed(8) }}</td>
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
    },
    data () {
      return {
        assets: [],
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
          { text: 'Coin', value: 'vcTye' },
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
        result.sort((a1, a2) => a1.vcType < a2.vcType ? -1 : 1)
        result.push(result.reduce((sum, a) => {
          sum.total += a.units * a.rate
          return sum
        }, { vcType: 'Summary', units: 0, rate: 0, total: 0 }))
        return result
      }
    },
    methods: {
      loadAssetsByBase (base) {
        axios.get(`/private/markets/poloniex/assets/${base}`).then(res => {
          this.assets = res.data.result
        }).catch(() => {})
      }
    }
  }
</script>
<style scoped lang="less">
</style>
