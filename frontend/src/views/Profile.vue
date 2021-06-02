<template>
    <div class="profile">
        <h1 class="profile__title">Profile de {{user.userName}}</h1>
        <p class="profile__body">Vous pouvez changer votre nom d'utilisateur si vous le souhaitez !</p>
        <p class="profile__body-btn"><button @click.prevent="triggerInput">Changer mon nom</button></p>
        <div class="profile__form" v-if="showInput">
            <p class="profile__form-input"><input type="text" v-model="name"></p>
            <p class="profile__form-btn"><button @click.prevent.stop="sendName">Envoyer</button></p>
        </div>   
    </div>
</template>

<script>
import Store from '../store'
import {mapState} from 'vuex'
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
        triggerInput(){
            this.showInput = true
        },
        sendName(){
           const userInfo = {
               name: this.name,
               userId: this.user.userId
           }
           if(this.name.length > 0){
               Store.dispatch('userUpdate', userInfo)
               this.showInput = false
           }else{
               alert('Votre nom ne peut être vide. Veuillez indiquer un nom!')
           }
           
        }
    }
}
</script>

<style lang="scss" scoped>
    .profile{
        display: flex;
        flex-direction: column;
        max-width: 800px;
        background-color: whitesmoke;
        margin: 0 auto;
        border: 4px dotted gray;
        &__title{
            display: block;
            display: flex;
            justify-content: center;
            font-size: 5em;
            font-weight: bold;
            padding: 20px
        }
        &__body{
            display: flex;
            padding: 20px;
            font-size: 2em;
            text-align: left;
            &-btn{
                display: flex;
                justify-content: center;
                button{
                    height: 30px;
                    font-size: 16px;
                    border-radius: 10px;
                    border: none;
                    background-color: rgb(211, 208, 208);
                    margin: 0 auto 10px auto;
                    &:hover{
                        background-color: rgb(187, 184, 184);
                    }
                }
            }
        }
        &__form{
            display: flex;
            flex-direction: column;
            padding: 10px;
            &-input{
                display: flex;
                input{
                    width: 100%;
                    height: 30px;
                    border: 2px dashed grey;
                }
            }
            &-btn{
                button{
                    margin: 20px auto;
                    height: 30px;
                    width: 80px;
                    border-radius: 10px;
                    border: none;
                    background-color: rgb(211, 208, 208);
                    &:hover{
                        background-color: rgb(187, 184, 184);
                    }
                }
            }
        }
    }
</style>