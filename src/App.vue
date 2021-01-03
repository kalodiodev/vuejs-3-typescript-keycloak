<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about" v-if="auth.keycloak.hasResourceRole('user')">About</router-link>
  </div>
  <router-view/>

  <button class="px-6 py-1 bg-gray-400 rounded text-white hover:bg-gray-500" @click="logout" v-if="authenticated">Logout</button>
  <button class="px-6 py-1 bg-gray-400 rounded text-white hover:bg-gray-500" @click="login" v-if="!authenticated">Login</button>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Authentication } from './auth'

@Options({
  props: {
    auth: Object
  }
})
export default class App extends Vue {
  msg!: string
  authenticated = false
  auth: any

  created () {
    const setAuth = this.setAuthenticated
    this.auth.keycloak.onReady = function (status: boolean) {
      setAuth(status)
    }
  }

  logout () {
    this.auth.logout()
  }

  login () {
    this.auth.login()
  }

  setAuthenticated (status: boolean) {
    this.authenticated = status
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
