<template>
  <div class="forum">
    <header>
      <div v-if="isLoggedIn"><button @click.stop.prevent="disconnect">Déconnection</button></div>
    </header>
    <div>
      <button @click.stop.prevent="openForm" v-if="posts !== null">Ecrire un article</button>
    </div>
    <write-form v-if="posts === null || openedFormular" @posted="closeForm"/>
    <post v-for="post in posts" :post="post" :key="post.postId"></post>
  </div>
</template>

<script>
// @ is an alias to /src
import post from '../components/Post.vue'
import WriteForm from '../components/WriteForm'
import {mapActions, mapState} from 'vuex'

export default {
  components: {post, WriteForm},
  name: 'Forum',
  data(){
    return{
      openedFormular: false,
    }
  },
  computed:{
    ...mapState(['posts', 'isLoggedIn']),
  },
  methods: {
    ...mapActions(['fetchPosts']),
    openForm(){
      return this.openedFormular = true
    },
    closeForm(){
      return this.openedFormular = false
    }
  }
}
</script>