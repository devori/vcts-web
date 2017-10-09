<template>
  <v-container class="white white--text">
    <v-snackbar
      :timeout="3000"
      :error="true"
      :top="true"
      :vertical="true"
      v-model="snacbar.show"
    >
      {{ snacbar.message }}
      <v-btn light flat @click.native="snacbar.show = false">Close</v-btn>
    </v-snackbar>
    <v-card class="elevation-10">
      <v-toolbar class="elevation-0">
        <v-card-title>
          <span>Login</span>
          <v-spacer></v-spacer>
        </v-card-title>
      </v-toolbar>
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
                @keyup.enter.native="onClickLogin"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-spacer></v-spacer>
          </v-layout>
          <v-layout row>
            <v-btn block round primary light @click.native="onClickLogin">LOGIN</v-btn>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-row actions>
        <v-btn flat class="indigo--text darken-1" @click.native="onClickCreateAccount">Create Account</v-btn>
      </v-card-row>
    </v-card>
  </v-container>
</template>
<script>
  import axios from 'axios'
  export default {
    data () {
      return {
        username: '',
        password: '',
        snacbar: {
          show: false,
          message: ''
        }
      }
    },
    methods: {
      onClickLogin () {
        let username = this.username
        let password = this.password
        if (!username || !password) {
          return
        }
        axios.post('/public/session', {
          username,
          password
        }).then(res => {
          this.$store.dispatch('login', username)
          this.$router.replace('/main/assets')
        }).catch(() => {
          this.snacbar.show = true
          this.snacbar.message = 'Failure'
        })
      },
      onClickCreateAccount () {
        this.snacbar.show = true
        this.snacbar.message = 'Not Supported'
      }
    }
  }
</script>
<style scoped lang="less">

  .container {
    max-width: 500px;
  }

</style>
