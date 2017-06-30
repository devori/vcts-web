<template>
  <v-app>
    <v-toolbar fixed class="indigo darken-4" light>
      <v-toolbar-title>Virtual Currency Trading System</v-toolbar-title>
    </v-toolbar>
    <main>
      <v-container fluid>
        <v-snackbar
          :timeout="3000"
          :error="true"
          :top="true"
          :vertical="true"
          v-model="showSnacbar"
        >
          Password is incorrect
          <v-btn light flat @click.native="showSnacbar = false">Close</v-btn>
        </v-snackbar>
        <v-card>
          <v-card-row class="indigo darken-1">
            <v-card-title>
              <span class="white--text">Login</span>
              <v-spacer></v-spacer>
            </v-card-title>
          </v-card-row>
          <v-card-text>
            <v-container fluid>
              <v-layout row>
                <v-flex xs4>
                  <v-subheader>ID</v-subheader>
                </v-flex>
                <v-flex xs8>
                  <v-text-field
                    label="Enter your account id"
                    v-model="username"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs4>
                  <v-subheader>Password</v-subheader>
                </v-flex>
                <v-flex xs8>
                  <v-text-field
                    label="Enter your password"
                    type="password"
                    v-model="password"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-spacing></v-spacing>
              </v-layout>
              <v-layout row>
                <v-btn block round primary light @click.native="onClickLogin">LOGIN</v-btn>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-row actions>
            <v-btn flat class="indigo--text darken-1">Create Account</v-btn>
          </v-card-row>
        </v-card>
      </v-container>
    </main>
  </v-app>
</template>
<script>
  import axios from 'axios'
  export default {
    data () {
      return {
        username: '',
        password: '',
        showSnacbar: false
      }
    },
    methods: {
      onClickLogin () {
        let username = this.username
        let password = this.password
        if (!username || !password) {
          return
        }
        axios.post(`/public/users/${username}/session`, {
          password
        }).then(res => {
          console.log(res.data)
        }).catch(err => {
          if (err.response.status === 401) {
            this.showSnacbar = true
          }
        })
      }
    }
  }
</script>
