<template>
  <v-layout>
    <v-flex xs12>
      <v-alert color="info" :value="true" class="headline">
        Total - {{ totalEstimation.toFixed(8) }}
      </v-alert>
      <v-toolbar light>
        <v-btn-toggle mandatory v-model="sort.target">
          <v-btn value="estimation">Estimation</v-btn>
          <v-btn value="vcType">Name</v-btn>
        </v-btn-toggle>
        <v-spacer></v-spacer>
        <v-btn-toggle mandatory v-model="sort.direction">
          <v-btn value="asc">ASC</v-btn>
          <v-btn value="desc">DESC</v-btn>
        </v-btn-toggle>
      </v-toolbar>
      <v-list :two-line="true">
        <v-list-group v-for="summary in listSortedSummaries" :value="summary.vcType" :key="summary.vcType" class="elevation-1">
          <v-list-tile slot="item" @click="onClickSummary(summary.vcType)">
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
          <v-list-tile v-for="asset in summary.assets" :key="asset.uuid"  @click="onClickAsset(summary.vcType, asset.uuid)">
            <v-list-tile-action>
              <v-checkbox :input-value="selectedAssets.ids.find(uuid => uuid === asset.uuid)"></v-checkbox>
            </v-list-tile-action>
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
    <v-snackbar
      :timeout="300000"
      color="red lighten-1"
      :value="showControlBox"
    >
      <v-btn dark flat :disabled="selectedAssets.ids.length <= 1" @click="onClickMerge">
        <v-icon>call_merge</v-icon>
        <span>Merge</span>
      </v-btn>
      <v-btn dark flat @click="onClickRemove">
        <v-icon>delete</v-icon>
        <span>Remove</span>
      </v-btn>
    </v-snackbar>
  </v-layout>
</template>
<script>
  import axios from 'axios'
  export default {
    mounted () {
      this.loadTickersByBase(this.bases[0])
      this.loadAssetsByBase(this.bases[0])
    },
    data () {
      return {
        assets: {},
        tickers: {},
        active: '',
        sort: {
          target: 'estimation',
          direction: 'desc'
        },
        selectedAssets: {
          vcType: '',
          ids: []
        }
      }
    },
    computed: {
      market () {
        return this.$route.params.market
      },
      bases () {
        return ['BTC']
      },
      totalEstimation () {
        return this.listSummaries.reduce((acc, s) => acc + s.estimation, 0)
      },
      listSortedSummaries () {
        let result = this.listSummaries.slice(0)
        result.sort((s1, s2) => {
          let b = 0
          if (s1[this.sort.target] < s2[this.sort.target]) {
            b = -1
          } else if (s1[this.sort.target] > s2[this.sort.target]) {
            b = 1
          }
          return b * (this.sort.direction === 'asc' ? 1 : -1)
        })
        return result
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
              uuid: a.uuid,
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
      },
      showControlBox () {
        return this.selectedAssets.ids.length > 0
      }
    },
    methods: {
      loadAssetsByBase (base) {
        return axios.get(`/private/markets/${this.market}/assets/${base}`).then(res => {
          this.assets = res.data
        }).catch(() => {})
      },
      loadTickersByBase (base) {
        return axios.get(`/private/markets/${this.market}/tickers/${base}`).then(res => {
          this.tickers = res.data
          this.tickers['BTC'] = { bid: 1 }
        }).catch(() => {})
      },
      onClickAsset (vcType, id) {
        if (this.selectedAssets.vcType === vcType) {
          if (this.selectedAssets.ids.find(aid => aid === id)) {
            this.selectedAssets.ids = this.selectedAssets.ids.filter(aid => aid !== id)
          } else {
            this.selectedAssets.ids = [...this.selectedAssets.ids, id]
          }
        } else {
          this.selectedAssets = {
            vcType,
            ids: [id]
          }
        }
      },
      onClickSummary (vcType) {
        if (this.selectedAssets.vcType === vcType) {
          return
        }
        this.selectedAssets = {
          vcType,
          ids: []
        }
      },
      onClickRemove () {
        const base = this.bases[0]
        const { vcType, ids } = this.selectedAssets
        ids.reduce((prom, id) => {
          return prom.then(() => {
            return axios.delete(`/private/markets/${this.market}/assets/${base}/${vcType}/${id}`)
          })
        }, Promise.resolve()).then(() => {
          return this.loadAssetsByBase(this.bases[0])
        }).then(() => {
          this.selectedAssets = {
            vcType: '',
            ids: []
          }
        })
      },
      onClickMerge () {
        const base = this.bases[0]
        const { vcType, ids } = this.selectedAssets
        axios.put(`/private/markets/${this.market}/assets/${base}/${vcType}?mode=merge`, { ids }).then(() => {
          return this.loadAssetsByBase(this.bases[0])
        }).then(() => {
          this.selectedAssets = {
            vcType: '',
            ids: []
          }
        }).catch(() => {})
      }
    }
  }
</script>
<style scoped lang="less">
</style>
