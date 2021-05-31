const multer = require('multer');

const MIME_TYPES = {
    'images/jpg' : 'jpg',
    'images/jpeg' : 'jpg',
    'images/png' : 'png'
};
const storage = multer.diskStorage({
    destination: (req, file, callback)=>{
        callback(null, 'images')
    },
    filename: (req, file, callback)=>{
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        console.log(extension)
        //callback(null, name + Date.now() + '.' + extension);
        callback(null, Date.now() + name);
    }
});

module.exports = multer({storage: storage}).single('image');