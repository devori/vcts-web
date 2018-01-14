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
              <v-slider prepend-icon="attach_money"
                        :disabled="info.isRunning"
                        :hint="`Min - ${info.minUnits} BTC`"
                        :persistent-hint="true"
                        :step="0.001"
                        :min="0.001"
                        :max="0.02"
                        @input="(units) => onChangeUnits(info.market, info.base, units, info.maxUnits)"
                        v-model="info.minUnits"/>
              <v-slider prepend-icon="attach_money"
                        :disabled="info.isRunning"
                        :hint="`Max - ${info.maxUnits} BTC`"
                        :persistent-hint="true"
                        :step="0.001"
                        :min="0.001"
                        :max="0.02"
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
            <div>Coin Setting</div>
            <v-btn icon @click.native="info.showDetails = !info.showDetails">
              <v-icon>{{ info.showDetails ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
            </v-btn>
          </v-card-actions>
          <v-slide-y-transition>
            <v-card-text v-show="info.showDetails">
              <v-layout row wrap>
                <v-flex xs6 v-for="(coin, key) in info.coins" :key="key">
                  <v-card class="blue lighten-4">
                    <v-card-title class="justify-space-between">
                      <div class="title">{{ coin.name }}</div>
                      <v-btn icon flat @click="removeCoin(info.market, info.base, coin.name)">
                        <v-icon blue>close</v-icon>
                      </v-btn>
                    </v-card-title>
                    <v-card-text>
                      <v-checkbox :disabled="info.isRunning"
                                label="Purchase"
                                v-model="coin.purchase.inUse"
                      />
                      <v-checkbox :disabled="info.isRunning"
                                label="Sale"
                                v-model="coin.sale.inUse"
                      />
                    </v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
              <v-text-field label="Add Coin Name"
                            :disabled="info.isRunning"
                            clearable
                            v-model="coinName"
                            @keyup.enter="() => addCoin(info.market, info.base)"
              />
            </v-card-text>
          </v-slide-y-transition>
        </v-card>
      </v-flex>
      <v-flex>
        <v-btn block class="blue lighten-2"
               @click="showAddDialog = true"
        >
          Add Trader
        </v-btn>
      </v-flex>
      <v-dialog v-model="showAddDialog" max-width="300px">
        <v-card>
          <v-card-title>
            Add Trader
          </v-card-title>
          <v-card-text>
            <v-text-field label="Market Name"
                          v-model="marketName"
                          clearable
                          required/>
            <v-text-field label="Base Name"
                          v-model="baseName"
                          clearable
                          required/>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary"
                   :disabled="isDialogOkDisabled"
                   block
                   flat
                   @click.stop="onClickAddDialogOk">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>
<script>
  import axios from 'axios'

  export default {
    mounted () {
      this.loadAutoTraders()
    },
    data () {
      return {
        traders: [],
        coinName: '',
        showAddDialog: false,
        marketName: '',
        baseName: ''
      }
    },
    computed: {
      isDialogOkDisabled () {
        const market = this.marketName.toLowerCase()
        const base = this.baseName.toUpperCase()
        if (!market || !base) {
          return true
        }
        if (this.traders.find(t => t.market === market && t.base === base)) {
          return true
        }
        return false
      }
    },
    methods: {
      loadAutoTraders () {
        axios.get(`/private/auto-traders`).then(res => {
          this.traders = res.data.map(t => {
            t.interval /= 1000
            t.showDetails = true
            return t
          })
        }).catch(() => {})
      },
      getTrader (market, base) {
        return this.traders.find(t => t.market === market && t.base === base)
      },
      startAutoTrader (market, base) {
        const { interval, minUnits, maxUnits, coins } = this.getTrader(market, base)
        axios.post(`/private/auto-traders/${market}/${base}`, {
          interval: interval * 1000,
          minUnits,
          maxUnits,
          coins
        }).finally(() => {
          return this.loadAutoTraders()
        }).catch(() => {})
      },
      stopAutoTrader (market, base) {
        axios.delete(`/private/auto-traders/${market}/${base}`).finally(() => {
          return this.loadAutoTraders()
        }).catch(() => {})
      },
      onChangeTraderStatus (market, base) {
        const trader = this.getTrader(market, base)
        if (trader.isRunning) {
          this.startAutoTrader(market, base)
        } else {
          this.stopAutoTrader(market, base)
        }
      },
      toUpperCaseFirst (str) {
        if (!str) {
          return str
        }
        return str.substr(0, 1).toUpperCase() + str.substr(1)
      },
      onChangeUnits (market, base, minUnits, maxUnits) {
        const trader = this.getTrader(market, base)
        if (maxUnits < 0.002) {
          maxUnits = 0.002
        }
        if (minUnits >= maxUnits) {
          minUnits = maxUnits - 0.001
        }
        trader.minUnits = minUnits
        trader.maxUnits = maxUnits
      },
      addCoin (market, base) {
        const name = this.coinName.toUpperCase()
        if (!name) {
          return
        }
        const trader = this.getTrader(market, base)
        if (trader.coins.some(coin => coin.name === name)) {
          return
        }
        trader.coins.push({
          name,
          purchase: { inUse: true },
          sale: { inUse: true }
        })
      },
      removeCoin (market, base, name) {
        const trader = this.getTrader(market, base)
        const index = trader.coins.findIndex(coin => coin.name === name)
        trader.coins.splice(index, 1)
      },
      onClickAddDialogOk () {
        this.showAddDialog = false
        const market = this.marketName.toLowerCase()
        const base = this.baseName.toUpperCase()
        this.traders.push({
          market,
          base,
          interval: 300000,
          minUnits: 0.002,
          maxUnits: 0.01,
          coins: [],
          showDetails: false
        })
      }
    }
  }
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
