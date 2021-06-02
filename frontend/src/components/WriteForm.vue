<template>
    <div>
        <p><label for="title">Titre :</label></p>
        <p><input type="text" id="title" name="title" v-model="title"></p>
        <p><label for="article">Article : </label></p>
        <p><textarea type="text" id="article" name="article" v-model="article"/></p>
        <p><label for="image" class="add-image-btn">Ajouter une image</label></p>
        <p style="display: none"><input type="file" id="image" @change="handleFile" name="image"></p>
        <p><button @click.stop.prevent="sendForm">Poster l'article</button></p>
    </div>
</template>

<script>
import Store from '../store'
export default {
    name: "WriteForm",
    props: ['openedFormular'],
    data(){
        return{
            title:"",
            article: "",
            uploadedImage: null
        }
    },
    methods:{
        handleFile(e){
            const image = e.target.files[0]
            this.uploadedImage = image
        },
        sendForm(){
            if(this.uploadedImage !== null){
               const formData = new FormData()
            formData.append('image',this.uploadedImage)
            const payload = {
                title: this.title,
                article: this.article,
                image: formData
            }
            Store.dispatch('sendPostWithImage', payload)
            this.uploadedImage = null
            this.$emit('posted')
            }else{
                const payload = {
                title: this.title,
                article: this.article
                }
                Store.dispatch('sendPost', payload)
                this.$emit('posted') 
            } 
        }
    }
}
</script>

<style lang="scss" scoped>
    div{
        display: flex;
        flex-direction: column;
        margin: auto;
        padding: 10px;
        max-width: 600px;
        background-color: whitesmoke;
        border: 2px dotted gray;
        p{
            display: flex;
            padding: 5px;
            text-align: left;
            .add-image-btn{
                display: block;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 5px;
                border: 1px solid black;
                width: 150px;
                height: 20px;
                &:hover{
                    background-color: rgb(187, 194, 194);
                }
            }
            input{
                display: block;
                width: 100%;
                border: 2px dashed gray;
            }
            textarea{
                display: block;
                width: 100%;
                height: 120px;
                border: 2px dashed gray;
            }
            button{
                display: block;
                width: 100px;
                height: 30px;
                margin: 0 auto;
                border-radius: 10px;
                border: none;
                background-color: rgb(187, 194, 194);
                &:hover{
                    background-color: gray;
                }
            }
        }
    }
</style>