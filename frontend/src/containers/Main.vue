<template>
  <v-layout row wrap>
    <v-flex xs12 sm12 md10 lg8 offset-lg2 offset-md1 class="my-1">
      <v-card class="indigo lighten-5" flat>
        <v-toolbar light class="indigo primary" >
          <v-toolbar-side-icon light></v-toolbar-side-icon>
          <v-toolbar-title light>Title</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn light icon>
            <v-icon>search</v-icon>
          </v-btn>
          <v-btn light icon>
            <v-icon>favorite</v-icon>
          </v-btn>
          <v-btn light icon>
            <v-icon>more_vert</v-icon>
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
  export default {
    data () {
      return {}
    },
    mounted () {
      if (this.$store.state.username === null) {
        this.$router.replace('/')
      }
    }
  }
</script>
