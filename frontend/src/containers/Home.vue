<template>
  <v-app>
    <v-navigation-drawer persistent v-model="drawer" light enable-resize-watcher>
      <v-list dense>
        <v-list-item>
          <v-list-tile @click.native.stop="left = !left">
            <v-list-tile-action>
              <v-icon>edit</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>로그인</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-item>
        <v-divider dark></v-divider>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar class="indigo" light>
      <v-toolbar-side-icon light @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Virtual Currency Trading System</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <main>
      <v-container fluid>
        <v-alert info v-bind:value="true">
          {{ result }}
        </v-alert>
        <v-layout row>
          <v-flex xs4>
            <v-subheader>Username</v-subheader>
          </v-flex>
          <v-flex xs8>
            <v-text-field v-model="username"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs4>
            <v-subheader>Password</v-subheader>
          </v-flex>
          <v-flex xs8>
            <v-text-field v-model="password"></v-text-field>
          </v-flex>
        </v-layout>
        <v-btn round primary light v-on:click.native="login">Login</v-btn>
        <v-btn round primary light v-on:click.native="logout">Logout</v-btn>
      </v-container>
    </main>
    <v-footer class="indigo">
      <span>© 2017</span>
    </v-footer>
  </v-app>
</template>
<script>
  import axios from 'axios'
  export default {
    data () {
      return {
        drawer: true,
        left: null,
        result: 'Unauthenticated',
        username: '',
        password: ''
      }
    },
    methods: {
      login () {
        axios.post(`/api/public/users/${this.username}/session`, {
          password: this.password
        }).then((res) => {
          this.result = res.data.result
        }).catch(e => {
          if (e.response) {
            this.result = 'Login'
          } else {
            this.result = 'error'
          }
        })
      },
      logout () {
        axios.delete(`/api/private/users/${this.username}`).then((res) => {
          this.result = res.data.result
        }).catch(e => {
          if (e.response) {
            this.result = e.response.data.result
          } else {
            this.result = 'error'
          }
        })
      }
    }
  }
</script>
