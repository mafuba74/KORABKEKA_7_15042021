<template>
    <div class="signup">
        <h1>INSCRIPTION</h1>
        <div class="input">
            <p><label for="userName">Nom:</label></p>
            <p><input type="text" id="userName" v-model="userName"></p>
        </div>
        <div class="input">
            <p><label for="password">Mot de passe:</label></p>
            <p><input type="password" name="password" id="password" v-model="password"></p>
        </div>                
        <button @click.prevent="login">S'inscrire</button>
    </div>
</template>

<script>
import store from '../store'
export default {
    name: "Signup",
    data(){
        return{
            userName: "",
            password: ""
        }
    },
    methods: {
        login(){
            let userInfo = {
                name: this.userName,
                password: this.password
            }
            //let jsonUser = JSON.stringify(userInfo)
            store.dispatch('userSignup', userInfo)
        }
    }
}
</script>

<style lang="scss" scoped>
.signup{
        width: 80%;
        max-width: 600px;
        padding: 40px;
        margin: 50px auto;
        .input{
            p{
                display: flex;
                text-align: left;
                margin: 20px auto;
            }
            input{
                width: 100%;
                font-size: 20px;
                border: 2px dotted grey;
            }
        }
        button{
            background-color: whitesmoke;
            border: 1px solid black;
            width: 150px;
            height: 50px;
            border-radius: 50px;
            &:hover{
                background-color: rgb(187, 184, 184);
            }
        }
    }
</style>