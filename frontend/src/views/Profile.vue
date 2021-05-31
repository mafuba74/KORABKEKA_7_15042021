<template>
    <div>
        <h1>Profile de {{user.userName}}</h1>
        <p>Vous pouvez changer votre nom d'utilisateur si vous le souhaitez</p>
        <p><button @click.prevent="triggerInput">Changer mon nom</button></p>
        <div v-if="showInput">
            <p><input type="text" v-model="name"></p>
            <p><button @click.prevent.stop="sendName">Envoyer</button></p>
        </div>
        
        
    </div>
</template>

<script>
import Store from '../store'
import {mapActions, mapState} from 'vuex'
export default {
    name: "Profile",
    data(){
        return{
            showInput: false,
            name: ""
        }
    },
    computed: {
        ...mapState(['user'])
    },
    methods: {
        ...mapActions(['userUpdate']),
        triggerInput(){
            this.showInput = true
        },
        sendName(){
           const userInfo = {
               name: this.name,
               userId: this.user.userId
           }
           Store.dispatch('userUpdate', userInfo)
        }
    }
}
</script>