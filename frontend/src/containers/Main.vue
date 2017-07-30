<template>
  <v-layout row wrap>
    <v-flex xs12 sm12 md10 lg8 offset-lg2 offset-md1 class="my-1">
      <v-card class="indigo lighten-5" flat>
        <v-toolbar light class="indigo primary" >
          <v-toolbar-side-icon light></v-toolbar-side-icon>
          <v-toolbar-title light>Title</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn light flat @click.native="onClickLogout">
            Logout
          </v-btn>
        </v-toolbar>
      </v-card>
    </v-flex>
    <v-container fluid>
      <router-view></router-view>
    </v-container>
  </v-layout>
</template>
<script>
  import axios from 'axios'
  export default {
    data () {
      return {}
    },
    methods: {
      onClickLogout () {
        axios.delete('/private/session').then(() => {
          this.$store.dispatch('logout')
          this.$router.replace('/')
        }).catch(err => {
          if (err.response.status === 401) {
            this.$router.replace('/')
          }
        })
      }
    }
  }
</script>
