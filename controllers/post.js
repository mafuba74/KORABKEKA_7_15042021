//const Sauce = require('../models/sauce');
const fs = require('fs');

exports.getPosts = async(req, res, next)=>{
    await Post.findAll()
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(400).json({ error }));
};

exports.findPost = async(req, res, next)=>{
    await Post.findOne({where: {id: req.params.id}})
        .then(post => res.status(200).json(post))
        .catch(error => res.status(404).json({ error }));
};

exports.postComment = async(req, res, next)=>{
  await Com.sync();
  await Com.create({
    text: req.body.text,
    postId: req.params.id,
    userId: req.body.userId
  })
  .then(comment => res.status(201).json({message: "commentaire créé" + comment}))
  .catch(err => res.status(400).json({err}));
};

exports.getComments = async(req, res, next)=>{
  await Com.findAll({where: {postId : req.params.id}})
      .then(coms => res.status(200).json(coms))
      .catch(error => res.status(400).json({ error }));
};

exports.postPost = async(req, res, next)=>{
    /*const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });*/
    await Post.sync({force: true});
    await Post.create({
      title: req.body.title,
      text: req.body.text,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.updatePost = async(req, res, next)=>{
    const sauceObject = req.file ? { 
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
    await Post.update({title: req.body.title,
      article: req.body.text,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    },{where: {
      id: req.params.id
    }})
    .then(()=> res.status(200).json({message: "objet modifié"}))
    .catch(err => res.status(400).json({err}));
};

exports.likePost = async(req, res, next)=>{
  await Like.sync();
  await Like.create({
    userId : req.body.userId,
    postId: req.params.id,
    like: req.body.like
  })
  .then(liked => res.status(200).json({message: "ce post a été liké", liked}))
  .catch(err => res.status(400).json({err}));
};

exports.deletePost = async(req, res, next)=>{
    await Post.findOne({where: {id: req.params.id}})
    .then(post => {
      const fileName = post.imageUrl.split('/images/')[1];
      fs.unlink(`images/${fileName}`, async()=>{
        await Post.destroy({ where: {id: req.params.id}})
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })  
};

exports.deleteCom = async(req, res, next)=>{
  await Com.destroy({where: {id: req.body.comId}})
  .then(()=> res.status(200).json({message: "Commentaire supprimé!"}))
  .catch(err => res.status(400).json({err}));
};

/*exports.sauceLikes = (req, res, next) => {
  
  const sauceObject = req.body;

  if (sauceObject.like === 1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { likes: +1 },
        $push: { usersLiked: req.body.userId },
      }
    )
      .then(() => res.status(200).json({ message: "like saved !" }))
      .catch((error) => res.status(400).json({ error }));
  } else if (sauceObject.like === -1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { dislikes: +1 },
        $push: { usersDisliked: req.body.userId },
      }
    )
      .then(() => res.status(200).json({ message: "dislike saved !" }))
      .catch((error) => res.status(400).json({ error }));
  } else {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce.usersLiked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $pull: { usersLiked: req.body.userId },
              $inc: { likes: -1 },
            }
          )
            .then(() => res.status(200).json({ message: "like deleted !" }))
            .catch((error) => res.status(400).json({ error }));
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $pull: { usersDisliked: req.body.userId },
              $inc: { dislikes: -1 },
            }
          )
            .then(() =>
              res.status(200).json({ message: "dislike deleted !" })
            )
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(400).json({ error }));
  }
};*/