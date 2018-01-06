<template>
  <div>
    <v-navigation-drawer light temporary absolute v-model="showDrawer">
      <v-toolbar flat light>
        <v-toolbar-title>VCTS</v-toolbar-title>
      </v-toolbar>
      <v-divider></v-divider>
      <v-list dense class="pt-0">
        <v-list-tile v-for="m in menus" :key="m.title" @click="movePage(m.path)">
          <v-list-tile-action>
            <v-icon>{{ m.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ m.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar dark color="primary">
      <v-toolbar-side-icon @click="showDrawer = !showDrawer"></v-toolbar-side-icon>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat @click.native="onClickLogout">
        Logout
      </v-btn>
    </v-toolbar>
    <main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </main>
  </div>
</template>
<script>
  import axios from 'axios'
  export default {
    data () {
      return {
        showDrawer: false,
        menus: [
          {
            icon: 'list',
            title: 'Markets',
            path: '/main/markets'
          },
          {
            icon: 'desktop_windows',
            title: 'Auto Trader',
            path: '/main/auto-trader'
          }
        ]
      }
    },
    computed: {
      title () {
        const path = this.$route.path
        if (path.startsWith('/main/markets')) {
          if (path === '/main/markets') {
            return 'Markets'
          }
          const title = this.$route.params.market
          return title.substring(0, 1).toUpperCase() + title.substring(1)
        } else if (path.startsWith('/main/auto-trader')) {
          return 'Auto-Trader'
        }
      }
    },
    methods: {
      movePage (path) {
        this.$router.push(path)
        this.showDrawer = false
      },
      onClickLogout () {
        axios.delete('/private/session').then(() => {
          this.$store.dispatch('logout')
        }).then(m => {
          this.$router.replace('/')
        }).catch(() => {
          this.$router.replace('/')
        })
      }
    }
  }
</script>
