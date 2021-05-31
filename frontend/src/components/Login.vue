<template>
    <div class="login">
        <h1>LOGIN</h1>
        <div class="input">
            <p><label for="logUserName">Nom:</label></p>
            <p><input type="text" id="logUserName" v-model="userName"></p>
        </div>
        <div class="input">
            <p><label for="logPassword">Mot de passe:</label></p>
            <p><input type="password" name="password" id="logPassword" v-model="password"></p>
        </div>                
        <button @click.prevent="login">Se connecter</button>
    </div>
</template>

<script>
import store from '../store'
export default {
    name: "Login",
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
            store.dispatch('userLogin', userInfo)
        }
    }
}
</script>

<style lang="scss" scoped>
    .login{
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
        }
    }
</style>