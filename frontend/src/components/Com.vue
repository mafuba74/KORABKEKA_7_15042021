<template>
    <div class="com">
        <div class="com__author">{{com.author}}</div>
        <section class="com__body" id="comment">           
            <div class="com__body-text" v-if="!modifyingCom">
                {{com.text}}
            </div>
            <div class="com__body-form" v-else>
                <textarea v-model="com.text"></textarea>
                <button @click.stop.prevent="updateCom">mettre à jour</button>
            </div>
        </section>
        <section id="options">
            <button v-if="com.author === user.userName" @click.stop.prevent="showForm">modifier</button>
            <button v-if="com.author === user.userName || user.isAdmin" @click.stop.prevent="deleteCom">supprimer</button>
        </section>
    </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
    name: 'Com',
    props: ['com'],
    data(){
        return {
            modifyingCom: false
        }
    },
    computed:{
        ...mapState(['user'])
    },
    methods: {
        showForm(){
            return this.modifyingCom = true
        },
        updateCom(){
            const payload = {
                text: this.com.text,
                comId: this.com.id,
            }
            console.log(payload)
            if(payload.text.length >= 1){
                this.$emit('updated', payload)
                this.modifyingCom = false
            }else{
                alert('Votre commentaire ne peut pas être vide cela n\'a pas de sens !')
            }   
        },
        deleteCom(){
            const payload = this.com.id
            this.$emit('comDeleted', payload)
        }
    }
}
</script>

<style lang="scss" scoped>
    .com{
        display: flex;
        flex-direction: column;
        margin: 20px 0;
        position: relative;
        &__author{
            position: absolute;
            border: 1px solid black;
            border-radius: 5px;
            min-width: 100px;
            top: -10px;
            left: -10px;
            background-color: black;
            color: white;
        }
        &__body{
            background-color: rgb(187, 194, 194);
            padding: 10px;
            border-top-right-radius: 20px;
            border-bottom-left-radius: 20px;
            &-text{
                padding: 5px;
                text-align: left;
                &::first-letter{
                    text-transform: uppercase;
                }
            }
            &-form{
                display: flex;
                flex-direction: column;
                textarea{
                    border: 2px dashed gray;
                    margin-bottom: 10px;
                }
                button{
                    width: 100px;
                    height: 30px;
                    margin: 0 auto;
                    border: none;
                    border-radius: 5px;
                    &:hover{
                        background-color: gray;
                    }
                }
            }
        }
        #options{
            text-align: right;
        }
    }
</style>