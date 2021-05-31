const express = require('express');
//const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const path = require('path');
const {Sequelize, DataTypes, json} = require('sequelize');
const bcrypt = require('bcrypt');
const jsontoken = require('jsonwebtoken');
const passwordValidator = require('password-validator');
const fs = require('fs');

const schema = new passwordValidator();

schema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

const helmet = require('helmet');
const auth = require('./middleware/auth');
const multer = require('./middleware/multer-config');

const app = express();

//connect to database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db.sqlite'
});



const User = sequelize.define('user', {
  name: {
    type: DataTypes.CHAR(20),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

const Post = sequelize.define('post', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  article: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

const Image = sequelize.define('image', {
  imageUrl: {
    type: DataTypes.STRING
  }
})

const UploadedImage = sequelize.define('uploadedImage', {
  imageUrl: DataTypes.STRING
})

const Com = sequelize.define('com', {
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  author: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

const Like = sequelize.define('like', {
  like: DataTypes.INTEGER
});

User.hasMany(Post);
Post.belongsTo(User);
User.hasMany(Com);
Com.belongsTo(User);
User.hasMany(Like);
Like.belongsTo(User);
Post.hasMany(Com);
Com.belongsTo(Post);
Post.hasOne(UploadedImage);
UploadedImage.belongsTo(Post);
Post.hasMany(Like);
Like.belongsTo(Post);

const db =  async ()=>{
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  }catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  await User.sync();
  await Post.sync();
  await Com.sync();
  await UploadedImage.sync();
  await Like.sync();
};
//var db = require('./models/modelsconfig');
db();

app.use(bodyParser.json());  

app.use(helmet());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(limiter);
app.use('/images', express.static(path.join(__dirname,'images')));


//création d'un User
app.post('/users/signup', async(req, res, next)=>{
  if(schema.validate(req.body.password) === false){
      return res.status(400).json({ error: "mot de passe ne remplit pas les critères de sécurité!"})
  }
  console.log(req.body)
  bcrypt.hash(req.body.password, 10)
  .then(async(hash) => {
      await User.create({
          name: req.body.name,
          password: hash
      }).then(user => res.status(201).json({message: "Utilisateur enregistré"}))
      .catch(err => res.status(500).json({err: "erreur utilisateur"}));
  }).catch(err => res.status(500).json({err: "erreur bcrypt"}));
});

// login d'un User
app.post('/users/login', async(req, res, next)=>{
  await User.findOne({
      where: {
          name: req.body.name
      }
  })
  .then(user =>{
      if(!user){
          return res.status(401).json({error: 'Utilisateur non trouvé!'});
      }
      bcrypt.compare(req.body.password, user.password)
      .then(valid=>{
          if(!valid){
              return res.status(401).json({error: 'Mot de passe incorrecte!'})
          }
          res.status(200).json({
              userId: user.id,
              userName: user.name,
              isAdmin: user.isAdmin,
              token: jsontoken.sign(
                  {userId: user.id},
                  "MY_SUPER_SECRET_KEY_NOBODY_CAN_FIND",
                  {expiresIn: '24h'})
          });
      })
      .catch(error => res.status(500).json({error}));
  })
  .catch(error => res.status(500).json({error}));
});

//modification d'un User
app.put('/users/:id',auth, async(req, res, next)=>{
  await User.update({name: req.body.name},{where: {
    id: req.params.id
  }})
  .then(user=>{
    console.log(user)
    res.status(200).json(user)
  }) 
  .catch(err => res.status(400).json({err}));
});

//suppression d'un User
/*app.delete('/users/:id', auth, async(req, res, next)=>{
  await User.destroy({where: {
    id: req.params.id
  }})
  .then(()=> res.status(200).json({message: "Utilisateur supprimé"}))
  .catch(err=> res.status(400).json({err}));
});*/

//cherche tous les posts
app.get('/post',auth, async(req, res, next)=>{
  try {
   const posts = (await Post.findAll({include: [User, Com, Like, UploadedImage]}))
    .map(post => {
      post.user.password = null;
      return post
    })
    res.status(200).json(posts);
  } catch (error ) {
    console.log(error);
    res.status(400).json({ error })
  }
   // .then(posts => res.status(200).json(posts))
   // .catch(error =>);
});

//cherche un post
/*app.get('/post/:id',auth, async(req, res, next)=>{
  await Post.findOne({where: {id: req.params.id}})
      .then(post => res.status(200).json(post))
      .catch(error => res.status(404).json({ error }));
});*/

//cherche tous les commentaires d'un post
/*app.get('/post/:id/comment',auth, async(req, res, next)=>{
  await Com.findAll({where: {postId : req.params.id}})
      .then(coms => res.status(200).json(coms))
      .catch(error => res.status(400).json({ error }));
});*/

//création d'un post
app.post('/post', auth, async(req, res, next)=>{
  console.log(req)
      await Post.create({
      title: req.body.title,
      article: req.body.article,
      userId: req.body.userId
    })
    .then(post => res.status(201).json(post))
    .catch(error => res.status(400).json({ error }));
});

//modification d'un post
app.put('/post/:id',auth, async(req, res, next)=>{
  await Post.update({title: req.body.title,
    article: req.body.article
  },{where: {
    id: req.params.id
  }})
  .then(post=> res.status(200).json(post))
  .catch(err => res.status(400).json({err}));
});

//suppression d'un post
app.delete('/post/:id',auth, async(req, res, next)=>{
      await Post.destroy({ where: {id: req.params.id}})
        .then(() => res.status(200).json({ message: 'Post supprimé !'}))
        .catch(error => res.status(400).json({ error }));
    });

//ajoute une image uploadée liée à un post
app.post('/post/:id/image', auth, multer, async(req, res, next)=>{
  console.log(req)
  await UploadedImage.create({
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    postId: req.params.id
  })
  .then(() => res.status(201).json({message: 'image ajoutée avec succès'}))
  .catch(error => res.status(400).json({ error }));
})

//modifie une image uploadée
/*app.put('/post/:id/image/:uploadedImageId', auth, async(req, res, next)=>{
  const currentImage = await Image.findOne({
    where: {
      id: req.params.imageId
    }
  })
  const fileName = currentImage.imageUrl.split('/images/')[1];
      fs.unlink(`images/${fileName}`, async()=>{
        await UploadedImage.update({
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        },{ where: {id: req.params.uploadedImageId}})
          .then(() => res.status(200).json({ message: 'image modifiée !'}))
          .catch(error => res.status(400).json({ error }));
      });
})*/

// supprime une image uploadée
app.delete('/post/:id/image/:uploadedImageId', auth, async(req, res, next)=>{
  const currentImage = await UploadedImage.findOne({
    where: {
      id: req.params.uploadedImageId
    }
  })
    const fileName = currentImage.imageUrl.split('/images/')[1];
      fs.unlink(`images/${fileName}`, async()=>{
        await UploadedImage.destroy({ where: {id: req.params.uploadedImageId}})
          .then(() => res.status(200).json({ message: 'image supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });  
});

//création d'un commentaire à un post
app.post('/post/:id/comment',auth, async(req, res, next)=>{
  await Com.create({
    text: req.body.text,
    postId: req.params.id,
    userId: req.body.userId,
    author: req.body.author
  })
  .then(comment => res.status(201).json(comment))
  .catch(err => res.status(400).json({err}));
});
//modifie un commentaire
app.put('/post/:id/comment/:commentId', async(req, res, next)=>{
  await Com.update({
    text: req.body.text
  }, {where: {id: req.params.commentId}})
  .then(comment => res.status(201).json(comment))
  .catch(err => res.status(400).json({err}));
})
//suprime un commentaire
app.delete('/post/:id/comment/:commentId', async(req, res, next)=>{
  await Com.destroy({where: {id: req.params.commentId}})
  .then(() => res.status(200).json({message: 'commentaire supprimé'}))
  .catch(err => res.status(400).json({err}));
})

//création d'un like à un post
app.post('/post/:id/like',auth, async(req, res, next)=>{
  await Like.create({
    userId : req.body.userId,
    postId: req.params.id,
    like: req.body.like
  })
  .then(liked => res.status(200).json({message: "ce post a été liké", liked}))
  .catch(err => res.status(400).json({err}));
});

//const postRoutes = require('./routes/post');
//const userRoutes = require('./routes/user');

//app.use('/api/sauces', postRoutes);
//app.use('/api/auth', userRoutes);


module.exports = app;