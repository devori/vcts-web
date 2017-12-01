<template>
  <v-layout>
    <v-flex xs12 v-for="(info, key) in traders">
      <v-card class="blue white--text">
        <v-card-title primary-title>
          <div class="headline">{{ key }}</div>
        </v-card-title>
        <v-card-text>
          Status: {{ info.status }}
        </v-card-text>
        <v-card-text v-if="info.status === 'running'">
          Interval: {{ info.interval / 1000 }} sec
        </v-card-text>
        <v-card-actions>
          <v-btn v-if="info.status === 'stop'" class="elevation-5" @click.native.stop="startAutoTrader(key)">Start</v-btn>
          <v-btn v-if="info.status === 'running'" class="elevation-5" @click.native.stop="stopAutoTrader(key)">Stop</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
  import axios from 'axios'
  export default {
    mounted () {
      this.loadAutoTraders()
    },
    computed: {
      listTraderNames () {
        return ['poloniex']
      }
    },
    data () {
      return {
        traders: {}
      }
    },
    methods: {
      loadAutoTraders () {
        axios.get(`/private/auto-traders`).then(res => {
          this.traders = {}
          this.listTraderNames.forEach(name => {
            if (res.data[name]) {
              this.traders[name] = {
                status: 'running',
                interval: res.data[name].interval
              }
            } else {
              this.traders[name] = { status: 'stop', interval: -1 }
            }
          })
        }).catch(() => {})
      },
      startAutoTrader (name) {
        axios.post(`/private/auto-traders/${name}`).then(res => {
          return this.loadAutoTraders()
        }).catch(() => {})
      },
      stopAutoTrader (name) {
        axios.delete(`/private/auto-traders/${name}`).then(res => {
          return this.loadAutoTraders()
        }).catch(() => {})
      }
    }
  }
</script>
<style scoped lang="less">
</style>
