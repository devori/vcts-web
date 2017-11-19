<template>
  <v-card flat>
    <v-data-table
        :headers="headers"
        :items="listHistories"
        :pagination.sync="pagination"
        class="elevation-1 text-xs-center"
      >
      <template slot="items" scope="props">
        <td class="text-xs-center">{{ props.item.vcType }}</td>
        <td class="text-xs-center">{{ props.item.type }}</td>
        <td class="text-xs-right">{{ props.item.units.toFixed(8) }}</td>
        <td v-if="props.item.type !== 'sell'" class="text-xs-right">{{ props.item.rate }}</td>
        <td v-if="props.item.type === 'sell'" class="text-xs-right">{{ props.item.rate }}({{ props.item.buy }})</td>
        <td class="text-xs-right">{{ (props.item.units * props.item.rate) }}</td>
        <td class="text-xs-center">{{ new Date(props.item.timestamp).toLocaleString() }}</td>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
  import axios from 'axios'
  export default {
    mounted () {
      this.loadHistoriesByBase(this.bases[0])
    },
    data () {
      return {
        histories: {},
        active: '',
        pagination: {
          sortBy: 'timestamp',
          descending: true
        }
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
          { text: 'Type', value: 'type' },
          { text: 'Units', value: 'units' },
          { text: 'Rate', value: 'rate' },
          { text: 'Estimated Value', value: 'total' },
          { text: 'Datetime', value: 'timestamp' }
        ]
      },
      listHistories () {
        let result = []
        for (let vcType in this.histories) {
          if (vcType === 'BTC') {
            continue
          }
          this.histories[vcType].forEach(h => result.push(h))
        }
        return result
      }
    },
    methods: {
      loadHistoriesByBase (base) {
        axios.get(`/private/markets/poloniex/histories/${base}`).then(res => {
          this.histories = res.data
        }).catch(() => {})
      }
    }
  }
</script>
<style scoped lang="less">
</style>
