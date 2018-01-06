<template>
  <v-container grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12 sm12 md12 lg12 v-for="(info, key) in traders" :key="key">
        <v-card class="blue lighten-3">
          <v-card-title primary-title>
            <div class="trader-title">
              <div class="headline">{{ key.substr(0, 1).toUpperCase() + key.substr(1) }}</div>
              <div class="trader-title__onoff">
                <v-switch
                          :hide-details="true"
                          :label="info.isRunning ? 'running' : 'stop'"
                          v-model="info.isRunning"
                          @change="onChangeTraderStatus(key)"></v-switch>
              </div>
            </div>
          </v-card-title>
          <v-card-text>
            <v-slider prepend-icon="alarm"
                      :disabled="info.isRunning"
                      :hint="info.interval + ' Sec'"
                      :persistent-hint="true"
                      :step="10"
                      :min="10"
                      :max="300"
                      v-model="info.interval"></v-slider>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  import axios from 'axios'
  export default {
    mounted () {
      this.loadAutoTraders()
    },
    computed: {
    },
    data () {
      return {
        traders: {
          poloniex: {
            isRunning: false,
            interval: 300
          },
          binance: {
            isRunning: false,
            interval: 300
          }
        }
      }
    },
    methods: {
      loadAutoTraders () {
        axios.get(`/private/auto-traders`).then(res => {
          Object.keys(this.traders).forEach(name => {
            if (res.data[name]) {
              this.traders[name].isRunning = true
              this.traders[name].interval = res.data[name].interval
            } else {
              this.traders[name].isRunning = false
            }
          })
        }).catch(() => {})
      },
      startAutoTrader (name) {
        const interval = this.traders[name].interval
        axios.post(`/private/auto-traders/${name}?interval=${interval}`).then(res => {
          return this.loadAutoTraders()
        }).catch(() => {})
      },
      stopAutoTrader (name) {
        axios.delete(`/private/auto-traders/${name}`).then(res => {
          return this.loadAutoTraders()
        }).catch(() => {})
      },
      onChangeTraderStatus (name) {
        if (this.traders[name].isRunning) {
          this.startAutoTrader(name)
        } else {
          this.stopAutoTrader(name)
        }
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
