const jsontoken = require('jsonwebtoken');


module.exports = (req, res, next) =>{
    try{
        const token = req.headers.authorization/*.split(' ')[1]*/;
        const decodedToken = jsontoken.verify(token, "MY_SUPER_SECRET_KEY_NOBODY_CAN_FIND");
        const userId = decodedToken.userId;
        if(req.body.userId && req.body.userId !== userId){
            throw 'User Id non valable'
        }else{
            next();
        }
    } catch(error){
        res.status(401).json({ error: error | 'requête non authentifiée'});
    }
};