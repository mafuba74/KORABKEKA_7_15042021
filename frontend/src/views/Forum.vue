<template>
  <div class="forum">
    <div class="write-btn">
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
import {mapState} from 'vuex'

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
    openForm(){
      return this.openedFormular = true
    },
    closeForm(){
      return this.openedFormular = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .forum{
    header{
      display: flex;
      border: 1px solid black;
      padding: 10px;
      align-items: center;
      justify-content: flex-end;
      height: 50px;
    }
    .write-btn{
      display: flex;
      justify-content: center;
      padding: 10px;
      button{
        height: 30px;
        border-radius: 10px;
        border: none;
        background-color: rgb(211, 208, 208);
        &:hover{
          background-color: rgb(187, 184, 184);
        }
      }
    }
  }
</style>