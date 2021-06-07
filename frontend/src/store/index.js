import Vue from 'vue'
import Vuex from 'vuex'
import Router from '../router'
import { Post } from '../../models/Post'
import { User } from '../../models/User'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoggedIn: false,
    user: null,
    posts: null,
  },
  getters: {

  },
  mutations: {
    SET_POSTS(state, payload){
      const posts = []
      if(payload.length>0){
        for(let i=0; i < payload.length; i++){
        let post = new Post(payload[i].title, payload[i].article, payload[i].user.name, payload[i].id, payload[i].coms, payload[i].likes, payload[i].uploadedImage)
        posts.unshift(post)
        }
        state.posts = posts
        console.log(posts)
      }else{
        return state.posts = null
      }
    },
    SET_USER(state, payload){
      const currentUser = new User(payload.userId, payload.userName, payload.isAdmin)
      localStorage.setItem('groupomaniasessiontoken', payload.token)
      localStorage.setItem('groupomaniasessionuser', JSON.stringify(currentUser))
      console.log(localStorage.getItem('groupomaniasessionuser'))
      state.user = currentUser
      state.isLoggedIn = true
      Router.push({name: 'Forum'})
    },
    PERSIST_USER(state){
      console.log(localStorage.getItem('groupomaniasessionuser'))
      const storageUser = JSON.parse(localStorage.getItem('groupomaniasessionuser'))
      const persistantUser = new User(storageUser.userId, storageUser.userName, storageUser.isAdmin)
      state.user = persistantUser
      state.isLoggedIn = true
    },
    USER_UPDATE(state, payload){
      const updatedUser = new User(state.user.userId, payload, state.user.isAdmin)
      state.user = updatedUser
      localStorage.setItem('groupomaniasessionuser', JSON.stringify(updatedUser))
    },
    DISCONNECT(state){
      state.isLoggedIn = false
      state.user = null
      state.posts= null
      localStorage.removeItem('groupomaniasessiontoken')
      localStorage.removeItem('groupomaniasessionuser')
      Router.push({name: 'Auth'})   
    }
  },
  actions: {
    checkUser(){
      if(localStorage.getItem('groupomaniasessionuser')){
        this.commit('PERSIST_USER')
        this.dispatch('fetchPosts')
      }
    },
    async sendPostWithImage(context, payload){
      console.log(payload)
      let token = localStorage.getItem('groupomaniasessiontoken')
      await fetch('http://localhost:3000/post',{
        method: 'POST',
        headers: {
          'Authorization' : token,
          "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
          title: payload.title,
          article: payload.article,
          userId: this.state.user.userId
        }) 
      }).then(res => res.text().then(async(obj)=>{
        const postedObject = JSON.parse(obj)
        await fetch(`http://localhost:3000/post/${postedObject.id}/image`, {
          method: 'POST',
          headers: {
            'Authorization' : token
          },
          body: payload.image
        }).then(res => res.text().then(obj=>{
           console.log(obj)
           this.dispatch('fetchPosts')
        }).catch(err=> console.log(err)))
        .catch(err=> console.log(err))
      })).catch(err => console.log(err))
      
    },
    async sendPost(context, payload){
      let token = localStorage.getItem('groupomaniasessiontoken')
      await fetch(`http://localhost:3000/post`, {
          method: 'POST',
          headers: {
            'Authorization' : token,
            "Content-type": "application/json; charset=UTF-8"
          },
          body: JSON.stringify({
            title: payload.title,
            article: payload.article,
            userId: this.state.user.userId
          })
        }).then(res => res.text().then(obj =>{
          console.log(JSON.parse(obj))
          this.dispatch('fetchPosts')
        }).catch(err=> console.log(err)))
        .catch(err => console.log(err))
      },
    async updatePostWithImage(context, payload){
      console.log(payload)
      let token = localStorage.getItem('groupomaniasessiontoken')
      await fetch(`http://localhost:3000/post/${payload.postId}`,{
        method: 'PUT',
        headers: {
          'Authorization' : token,
          "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
          title: payload.title,
          article: payload.article
        }) 
      }).then(res => res.text().then(async()=>{
        await fetch(`http://localhost:3000/post/${payload.postId}/image`, {
          method: 'POST',
          headers: {
            'Authorization' : token
          },
          body: payload.image
        }).then(res => res.text().then(obj=> {
          console.log(obj)
          this.dispatch('fetchPosts')
        }).catch(err=> console.log(err)))
        .catch(err=> console.log(err))
      }))
      
    },
    async updatePost(context, payload){
      let token = localStorage.getItem('groupomaniasessiontoken')
      await fetch(`http://localhost:3000/post/${payload.postId}`,{
        method: 'PUT',
        headers: {
          'Authorization' : token,
          "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
          title: payload.title,
          article: payload.article
        }) 
      }).then(res =>{
        console.log(res.text())
        this.dispatch('fetchPosts')
      })
      .catch(err => console.log(err))
      
    },
    async deletePost(context, payload){
      console.log(payload)
      let token = localStorage.getItem('groupomaniasessiontoken')
      await fetch(`http://localhost:3000/post/${payload.postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization' : token
        }
      }).then(res => res.text().then(obj => {
        console.log(obj)
        this.dispatch('fetchPosts')
      })
      .catch(err=> console.log(err)))
      .catch(err => console.log(err))
    },
    async deleteImage(context, payload){
      console.log(payload)
      let token = localStorage.getItem('groupomaniasessiontoken')
      await fetch(`http://localhost:3000/post/${payload.postId}/image/${payload.imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization' : token
        }
      })
      .then(res => {
        console.log(res.text().then(obj =>{
          console.log(JSON.parse(obj))
          this.dispatch('fetchPosts')
        }))  
      })
      .catch(err => console.log(err)) 
    },
    async sendCom(context, payload){
      console.log(payload)
      let token = localStorage.getItem('groupomaniasessiontoken')
      await fetch(`http://localhost:3000/post/${payload.postId}/comment`, {
        method: "POST",
        headers: {
          'Authorization' : token,
          "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(payload)
      }).then(res => res.text().then(obj=>{
        console.log(JSON.parse(obj))
        this.dispatch('fetchPosts')
      }).catch(err=> console.log(err))
      .catch(err=> console.log(err)))
    },
    async updateCom(context, payload){
      console.log(payload)
      let token = localStorage.getItem('groupomaniasessiontoken')
      await fetch(`http://localhost:3000/post/${payload.postId}/comment/${payload.comId}`, {
        method: 'PUT',
        headers: {
          'Authorization' : token,
          "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({text: payload.text})
      }).then(res => res.text()
      .then(obj=>{
        console.log(JSON.parse(obj))
        this.dispatch('fetchPosts')
      }).catch(err=> console.log(err)))
      .catch(err=> console.log(err))
    },
    async deleteCom(context, payload){
      let token = localStorage.getItem('groupomaniasessiontoken')
      await fetch(`http://localhost:3000/post/${payload.postId}/comment/${payload.comId}`, {
        method: 'DELETE',
        headers: {
          'Authorization' : token
        }
      }).then(res=> res.text().then(obj=>{
        console.log(JSON.parse(obj))
        this.dispatch('fetchPosts')
      }).catch(err=> console.log(err))
      .catch(err=> console.log(err)))
    },
    async likePost(context, payload){
      let token = localStorage.getItem('groupomaniasessiontoken')
      await fetch(`http://localhost:3000/post/${payload.postId}/like`, {
        method: "POST",
        headers: {
          'Authorization' : token,
          "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
          userId: this.state.user.userId,
          like: 1
        })
      }).then(res=> res.text().then(obj=>{
        console.log(JSON.parse(obj))
        this.dispatch('fetchPosts')
      }).catch(err=> console.log(err)))
      .catch(err=> console.log(err))
    },
    async fetchPosts(context){
      let token = localStorage.getItem('groupomaniasessiontoken')
      await fetch('http://localhost:3000/post',{
        method: 'GET',
        headers: {
          'Authorization' : token
        }
      })
      .then(response => response.text())
      .then(obj => {
        let posts = JSON.parse(obj)
        console.log(posts)
        context.commit('SET_POSTS', posts)
      })
      .catch(error => console.log(error))
    },
    async userLogin(context, payload){
      await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {"Content-type": "application/json; charset=UTF-8"}
      })
      .then(res =>{if(res.status === 200){
        res.text().then(obj=>{
          let user = JSON.parse(obj)
          console.log(user)
          context.commit("SET_USER", user)
          this.dispatch('fetchPosts')
        })
        .catch(err=> console.log(err))
      }})
    },
    async userSignup(context, payload){
      console.log(payload)
      await fetch('http://localhost:3000/users/signup', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {"content-type": "application/json; charset=UTF-8"}
      })
      .then(response => response.text())
      .then(confirmation => {
        console.log(confirmation)
      })
      .catch(err => console.log(err))
    },
    async userUpdate(context, payload){
      console.log(payload)
      let name = payload.name
      let token = localStorage.getItem('groupomaniasessiontoken')
      await fetch(`http://localhost:3000/users/${payload.userId}`, {
        method: 'PUT',
        body: JSON.stringify({name}),
        headers: {
          "content-type": "application/json; charset=UTF-8",
          "Authorization": token
        }
      })
      .then(() =>{
        context.commit('USER_UPDATE', name)
        this.dispatch('fetchPosts')
      })
      .catch(err => console.log(err))
    },
    disconnect(context){
      context.commit('DISCONNECT')
    }, 
  },
  modules: {
  }
})
