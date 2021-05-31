<template>
    <div>
        <p><label for="title">Titre :</label></p>
        <p><input type="text" id="title" name="title" v-model="title"></p>
        <p><label for="article">Article : </label></p>
        <p><textarea type="text" id="article" name="article" v-model="article"/></p>
        <p><label for="image">Ajouter une image: </label></p>
        <p><input type="file" id="image" @change="handleFile" name="image"></p>
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
    
</style>