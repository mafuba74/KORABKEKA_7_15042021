<template>
    <div class="article">
        <header class="article__header">
            <div class="article__header-title" v-if="!updatingPost">
                <p>{{post.title}}</p>               
            </div>
            <div class="article__header-form" v-else>
                <label for="title">Titre: </label>
                <input type="text" id="title" name="title" v-model="post.title" >
            </div>           
        </header>
        <section class="article-author">
            <p>Publié par : {{post.author}} </p>
            <button class="btn-options" v-if="post.author === user.userName || user.isAdmin" @click.stop.prevent="showOptions"> ...</button>
            <ul class="options" v-if="optionDisplayed">
                <li v-if="post.author === user.userName"> <button class="btn1" @click.stop.prevent="openForm">modifier</button> </li>
                <li v-if="post.author === user.userName || user.isAdmin"> <button class="btn2" @click.stop.prevent="deletePost">supprimer</button></li>
            </ul> 
        </section>
        <section class="article__body" >
            <div class="article__body-text" v-if="!updatingPost">
                {{post.article}}
            </div>
            <div class="article__body-form" v-else>
                <label for="article">Texte: </label>
                <textarea  name="article" id="article" v-model="post.article"></textarea>
            </div>
            <div class="article__body__image" v-if="post.image">
                <img :src="post.image.imageUrl" :alt="post.image.imageUrl">
                <button v-if="updatingPost" @click.stop.prevent="deleteImage">Supprimer l'image</button> 
            </div>
            <p class="article__body__image-form" v-if="(imagedeleted || !post.image) && updatingPost">
                <label for="image">Ajouter une image</label>
                <input type="file" id="image" @change="addFile" name="image" style="display: none;">
            </p>
            <p v-if="updatingPost"><button class="updatebtn" @click.stop.prevent="updatePost">Mettre à jour</button></p>         
        </section>               
        <section class="article__coms" id="commentaires" v-if="post.comments.length > 0 && comVisible">
            <com v-for="com in post.comments" :com="com" :key="com.id" @updated="updateCom" @comDeleted="deleteCom"></com>
        </section>
        <section class="article__comment-form" id="comForm" v-if="commenting">
            <textarea v-model="userComment"></textarea>
            <button @click.stop.prevent="postCom">poster</button>
        </section>      
        <footer class="article__footer">
            <ul>
                <li><i class="far fa-thumbs-up" @click.stop.prevent="likePost">{{post.likes.length}}</i></li>
                <li> <button @click.stop.prevent="showComs">commentaires</button> </li>
                <li> <button @click.stop.prevent="openComForm">commenter</button> </li>    
            </ul>
        </footer>
    </div>
</template>

<script>
import Store from '../store'
import {mapState} from 'vuex'
import Com from '../components/Com'
export default {
    name: 'Post',
    components: {Com},
    props: ['post'],
    data(){
        return{
            comVisible: false,
            updatingPost: false,
            uploadedImage: null,
            imagedeleted: false,
            commenting: false,
            userComment: "",
            optionDisplayed: false
        }
    },
    computed: {
        ...mapState(['user'])
    },
    methods: {
        showOptions(){
            if(this.optionDisplayed){
                return this.optionDisplayed = false
            }else{
                return this.optionDisplayed = true
            }
        },
        showComs(){
            if(this.comVisible === false){
                this.comVisible = true
            }else{
                this.comVisible = false
            }            
        },
        addFile(e){
            const image = e.target.files[0]
            this.uploadedImage = image
        },
        deleteImage(){
            Store.dispatch('deleteImage', {
                postId: this.post.postId,
                imageId: this.post.image.id
            })
            return this.imagedeleted = true
        },
        updatePost(){
            if(this.uploadedImage !== null){
               const formData = new FormData()
            formData.append('image',this.uploadedImage)
            const payload = {
                title: this.post.title,
                article: this.post.article,
                postId: this.post.postId,
                image: formData
            }
            Store.dispatch('updatePostWithImage', payload)
            this.uploadedImage = null
            this.updatingPost = false
            this.imagedeleted = false
            }else{
                const payload = {
                title: this.post.title,
                article: this.post.article,
                postId: this.post.postId
                }
                Store.dispatch('updatePost', payload)
                this.updatingPost = false
            }
        },
        openForm(){
            this.updatingPost = true
            this.optionDisplayed = false
        },
        deletePost(){
            Store.dispatch('deletePost', {
                postId: this.post.postId
            })
            this.optionDisplayed = false
        },
        openComForm(){
            return this.commenting = true
        },
        postCom(){
            const payload = {
                text: this.userComment,
                postId: this.post.postId,
                userId: Store.state.user.userId,
                author: Store.state.user.userName
            }
            if(payload.text.length >=1){
                Store.dispatch('sendCom', payload)
                this.commenting = false
                this.userComment = ""
            }else{
                alert('Votre commentaire ne peut pas être vide cela n\'a pas de sens !')
                return
            }
            
        },
        updateCom(payload){
            Store.dispatch('updateCom', {
                text: payload.text,
                comId: payload.comId,
                postId: this.post.postId
            })
        },
        deleteCom(payload){
            Store.dispatch('deleteCom', {comId: payload, postId: this.post.postId})
        },
        likePost(){
            const like = this.post.likes.map(like => {
                return like.userId
            })
            if(like.includes(Store.state.user.userId)){
                return
            }else{
                Store.dispatch('likePost', {postId: this.post.postId})
            }
        }
    }
}
</script>

<style lang="scss" scoped>
*{
    box-sizing: border-box;
}
.article{
    width: 80%;
    max-width: 600px;
    margin: 50px auto;
    background-color: whitesmoke;
    border-radius: 15px;
    box-shadow: 0px 3px 14px 0px rgba(128, 128, 128, 0.8);
    -webkit-box-shadow: 0px 3px 14px 0px rgba(128, 128, 128, 0.8);
    -moz-box-shadow: 0px 3px 14px 0px rgba(128, 128, 128, 0.8);
    &__header{
        display: flex;
        align-items: center;
        height: 40px;
        &-title{
            width: 100%;
            text-transform: uppercase;
        }
        &-form{
            display: flex;
            align-items: center;
            width: 100%;
            text-align: left;
            label{
                margin-left: 10px;
            }
            input{
                display: block;
                flex-grow: 1;
                margin: 0 10px;
                width: 80%;
                min-height: 30px;
                font-size: 20px;
                border: 2px dashed gray;
                text-align: center;
                text-transform: uppercase;
            }
        }
    }
    &-author{
        display: flex;
        position: relative;
        justify-content: space-between;
        align-items: center;
        text-align: left;
        padding: 10px;
        background-color: rgb(187, 184, 184);
        .btn-options{
            display: flex;
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: none;
        }
        .options{
            position: absolute;
            right: 0;
            top: 40px;
            border: 1px solid black;
            button{
                width: 100px;
                height: 30px;
                border: none;
                &:hover{
                    background-color: gray;
                }
            }
            .btn1{
                border-bottom: 1px solid black;
            }
        }
    }
    &__body{
        display: flex;
        flex-direction: column;
        min-height: 20vh;
        width: 100%;
        margin: 0 auto;
        border-bottom: 2px solid rgb(187, 184, 184);
        &-text{
            text-align: left;
            font-size: 16px;
            min-height: 5em;
            padding: 10px;
        }
        &-form{
            display: flex;
            flex-direction: column;
            label{
                text-align: left;
                padding: 10px;
            }
            textarea{
                border: 2px dashed gray;
                font-size: 16px;
                min-height: 5em;
                padding: 10px;            
            }
        }
        &__image{
            display: flex;
            position: relative;
            img{
                width: 100%;
            }
            button{
                position: absolute;
                right: 0;
                bottom: 0;
                background-color: rgb(241, 103, 103);
                height: 30px;
                border: none;
                border-radius: 20px;
            }
        }
        .updatebtn{
            height: 30px;
            border-radius: 20px;
            border: none;
            background-color: rgb(164, 201, 164);
            margin: 10px 0;
        }
    }
    &__coms{
        display: flex;
        flex-direction: column;
        width: 90%;
        margin: 20px auto;
    }
    &__comment-form{
        display: flex;
        flex-direction: column;
        padding: 20px;
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
            background-color: rgb(187, 184, 184);
        }
    }
    &__footer{
        padding: 20px;
        background-color: rgb(187, 184, 184);
        border-bottom-left-radius: 15px;
        border-bottom-right-radius: 15px;
        ul{
            display: flex;
            justify-content: space-around;
            li{
                button{
                    position: relative;
                    border: none;
                    max-width: 100px;
                    height: 30px;
                    border-radius: 20px;
                    &:hover{
                        background-color: gray;
                    }
                }
                i{
                    display: block;
                    font-size: 25px;
                    color: black;
                }
            }
        }
    }
}
</style>