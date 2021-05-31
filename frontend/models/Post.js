export class Post{
    constructor(title, article, author, postId, comments, likes, image){
        this.title = title
        this.article = article
        this.author = author
        this.postId = postId
        this.comments = comments
        this.likes = likes
        this.image = image
    }
    getTitle(){
        return this.title
    }
    getArticle(){
        return this.article
    }
    getAuthor(){
        return this.author
    }
    getId(){
        return this.postId
    }
}