<template>
  <v-container fluid>
    <v-tabs light fixed centered>
      <v-tabs-bar slot="activators" class="indigo">
        <v-tabs-slider class="yellow"></v-tabs-slider>
        <v-tabs-item
          v-for="base in bases"
          :href="'#assets-tab-' + base"
        >
          {{ base }}
        </v-tabs-item>
      </v-tabs-bar>
      <v-tabs-content
        v-for="base in bases"
        :id="'assets-tab-' + base"
      >
        <v-card flat>
          <v-data-table
              :headers="headers"
              :items="filterByBase(base)"
              class="elevation-1 text-xs-center"
            >
            <template slot="items" scope="props">
              <td class="text-xs-center">{{ props.item.vcType }}</td>
              <td class="text-xs-right">{{ props.item.units }}</td>
              <td class="text-xs-right">{{ props.item.price }}</td>
              <td class="text-xs-center">{{ (new Date(props.item.timestamp)).toLocaleString() }}</td>
            </template>
          </v-data-table>
        </v-card>
      </v-tabs-content>
    </v-tabs>
  </v-container>
</template>
<script>
  export default {
    data () {
      return {
        headers: [
          { text: 'Coin', value: 'vcTye' },
          { text: 'Units', value: 'units' },
          { text: 'Price', value: 'price' },
          { text: 'Timestamp', value: 'timestamp' }
        ],
        assets: [
          {
            'base': 'USDT',
            'vcType': 'DASH',
            'units': 0.4,
            'price': 2500,
            'timestamp': 1,
            'uuid': '1'
          },
          {
            'base': 'BTC',
            'vcType': 'ETH',
            'units': 1,
            'price': 0.1,
            'timestamp': 2,
            'uuid': '2'
          },
          {
            'base': 'USDT',
            'vcType': 'BTC',
            'units': 0.5,
            'price': 2600,
            'timestamp': 3,
            'uuid': '3'
          }
        ]
      }
    },
    computed: {
      bases () {
        let result = []
        this.assets.forEach(i => result.push(i.base))
        result.sort((k1, k2) => k1 < k2 ? -1 : 1)
        for (let i = result.length - 1; i > 0; i--) {
          if (result[i - 1] === result[i]) {
            result.splice(i, 1)
          }
        }
        return result
      }
    },
    methods: {
      filterByBase (base) {
        let result = []
        this.assets.forEach(i => {
          if (i.base === base) {
            result.push(i)
          }
        })
        result.sort((i1, i2) => {
          if (i1.vcType < i2.vcType) return -1
          else if (i1.vcType > i2.vcType) return 1
          return i1.timestamp - i2.timestamp
        })
        return result
      }
    }
  }
</script>
<style scoped lang="less">
</style>
