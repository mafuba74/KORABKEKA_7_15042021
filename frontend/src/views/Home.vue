<template>
  <div class="home">
    <div v-if="isLoggedIn"><button @click.stop.prevent="disconnect">deconnecter</button></div>
    <router-view></router-view>
  </div>
</template>

<script>
// @ is an alias to /src
import Store from '../store'
import {mapState} from 'vuex'
export default {
  name: 'Home',
  computed: {
    ...mapState(['isLoggedIn'])
  },
  methods:{
    disconnect(){
      Store.dispatch('disconnect')
    }
  }
}
</script>