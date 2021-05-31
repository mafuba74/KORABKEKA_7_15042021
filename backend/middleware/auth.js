const jsontoken = require('jsonwebtoken');


module.exports = (req, res, next) =>{
    try{
        const token = req.headers.authorization/*.split(' ')[1]*/;
        const decodedToken = jsontoken.verify(token, "MY_SUPER_SECRET_KEY_NOBODY_CAN_FIND");
        
        const userId = decodedToken.userId;
        if(userId){
            next();
        }else{
            throw 'User Id non valable'
        }
    } catch(error){
        res.status(401).json({ error: error | 'requête non authentifiée'});
    }
};