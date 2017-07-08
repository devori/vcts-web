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
            :items="listByBase(base)"
            :pagination="{ rowsPerPage: -1 }"
            class="elevation-1 text-xs-center"
          >
          <template slot="items" scope="props">
            <td class="text-xs-center">{{ props.item.vcType }}</td>
            <td class="text-xs-right">{{ props.item.units }}</td>
            <td class="text-xs-right">{{ props.item.price }}</td>
            <td class="text-xs-center">{{ props.item.units * props.item.price }}</td>
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
      this.loadAssets()
    },
    data () {
      return {
        headers: [
          { text: 'Coin', value: 'vcTye' },
          { text: 'Units', value: 'units' },
          { text: 'Price', value: 'price' },
          { text: 'Total', value: 'total' }
        ],
        assets: {},
        active: ''
      }
    },
    computed: {
      bases () {
        let result = []
        for (let base in this.assets) {
          result.push(base)
        }
        result.sort((k1, k2) => k1 < k2 ? -1 : 1)
        for (let i = result.length - 1; i > 0; i--) {
          if (result[i - 1] === result[i]) {
            result.splice(i, 1)
          }
        }
        return result
      }
    },
    watch: {
      bases (newValue, oldValue) {
        if (newValue.length > 0) {
          this.$nextTick(() => {
            this.active = 'assets-tab-0'
          })
        }
      }
    },
    methods: {
      loadAssets () {
        axios.get('/private/markets/poloniex/assets').then(res => {
          for (let k in res.data.result) {
            this.$set(this.assets, k, res.data.result[k])
          }
        }).catch(() => {})
      },
      listByBase (base) {
        let result = []
        for (let k in this.assets[base]) {
          result.push(...this.assets[base][k])
        }
        return result
      }
    }
  }
</script>
<style scoped lang="less">
</style>
