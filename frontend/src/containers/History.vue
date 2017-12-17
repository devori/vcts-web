<template>
  <v-layout>
    <v-flex xs12>
      <v-alert :color="summary.profit >= 0 ? 'info': 'error'" :value="true" class="subheading elevation-1">
        <div>
          Profit/Loss: 0.10
        </div>
        <div>
          Total Buys: 1.00
        </div>
        <div>
          Total Sells: 1.07
        </div>
        <div>
          Balances: 0.3
        </div>
      </v-alert>
      <v-expansion-panel class="elevation-2">
        <v-expansion-panel-content>
          <div slot="header" >
            <div>
              <span>Coins: {{ conditions.coins ? conditions.coins : 'ALL' }}, </span>
            </div>
            <div>
              <span>{{ conditions.startDate }} ~ {{ conditions.endDate }}</span>
            </div>
          </div>
          <v-card>
            <v-card-text class="grey lighten-4">
              <v-flex xs10>
                <v-text-field v-model="conditions.coins" placeholder="Coins"></v-text-field>
              </v-flex>
              <v-menu transition="slide-y-transition">
                <v-text-field
                  slot="activator"
                  label="Start Date"
                  v-model="conditions.startDate"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-date-picker v-model="conditions.startDate" no-title scrollable actions>
                </v-date-picker>
              </v-menu>
              <v-menu transition="slide-y-transition">
                <v-text-field
                slot="activator"
                label="End Date"
                v-model="conditions.endDate"
                prepend-icon="event"
                readonly
                ></v-text-field>
                <v-date-picker v-model="conditions.endDate" no-title scrollable actions>
                </v-date-picker>
              </v-menu>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <br />
      <v-data-table
          :headers="headers"
          :items="listHistories | filterByCoins(conditions.coins) | filterByDate(conditions.startDate, conditions.endDate)"
          :pagination.sync="pagination"
          class="elevation-1 text-xs-center"
        >
        <template slot="items" slot-scope="props">
          <td class="text-xs-center">{{ props.item.vcType }}</td>
          <td class="text-xs-center">{{ props.item.type }}</td>
          <td class="text-xs-right">{{ props.item.units.toFixed(8) }}</td>
          <td v-if="props.item.type !== 'sell'" class="text-xs-right">{{ props.item.rate }}</td>
          <td v-if="props.item.type === 'sell'" class="text-xs-right">{{ props.item.rate }}({{ props.item.buy }})</td>
          <td class="text-xs-right">{{ (props.item.units * props.item.rate) }}</td>
          <td class="text-xs-center">{{ new Date(props.item.timestamp).toLocaleString() }}</td>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>
<script>
  import axios from 'axios'
  import moment from 'moment'
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
        },
        conditions: {
          startDate: moment().date(1).format('YYYY-MM-DD'),
          endDate: moment().format('YYYY-MM-DD'),
          coins: ''
        },
        summary: {
          profit: 0.1
        }
      }
    },
    filters: {
      filterByDate (list, startDate, endDate) {
        let startTimestamp = new Date(startDate)
        startTimestamp = startTimestamp.getTime() + startTimestamp.getTimezoneOffset() * 60000
        let endTimestamp = new Date(endDate)
        endTimestamp.setDate(endTimestamp.getDate() + 1)
        endTimestamp = endTimestamp.getTime() + endTimestamp.getTimezoneOffset() * 60000
        return list.filter(r => {
          return r.timestamp >= startTimestamp && r.timestamp < endTimestamp
        })
      },
      filterByCoins (list, coins) {
        if (!coins) {
          return list
        }
        coins = coins.split(' ')
                  .map(c => c.trim().toUpperCase())
                  .filter(c => c)
                  .reduce((map, c) => {
                    map[c] = true
                    return map
                  }, {})
        return list.filter(h => {
          return coins[h.vcType]
        })
      }
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
        return axios.get(`/private/markets/poloniex/histories/${base}`).then(res => {
          this.histories = res.data
        }).catch(() => {})
      }
    }
  }
</script>
<style scoped lang="less">
</style>
