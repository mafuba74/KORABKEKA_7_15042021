export class User {
    constructor(userId, userName, isAdmin){
        this.userId = userId
        this.userName = userName
        this.isAdmin = isAdmin
    }
    getId(){
        return this.userId
    }
    getName(){
        return this.userName
    }
}