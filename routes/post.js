const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const postCtrl = require('../controllers/post');

router.get('/', auth, postCtrl.getPosts); // trouver tous les posts (fait)
router.get('/:id', auth, postCtrl.findPost); //trouver un post (fait)
router.get('/:id/comments', auth, postCtrl.getComments); //trouver tous les commentaires d'un post (fait)


router.post('/:id/comments', auth, postCtrl.postComment); //publier un commentaire
router.post('/', auth, multer, postCtrl.postPost); // publier un post (fait)
router.put('/:id', auth,multer, postCtrl.updatePost); //modifier un post (fait)
router.post('/:id/like', auth, postCtrl.likePost); // liker un post (fait)
router.delete('/:id', auth, postCtrl.deletePost); // supprimer un post (fait)
router.delete('/:id/comments/:comId', auth, postCtrl.deleteCom); //supprimer un commentaire (fait)

module.exports = router;