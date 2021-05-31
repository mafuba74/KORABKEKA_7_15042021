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

const db =  async ()=>{
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  }catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
db();

const User = sequelize.define('user', {
  name: {
    type: DataTypes.CHAR(20),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
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

const Com = sequelize.define('com', {
  text: {
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
Post.hasMany(Like);
Like.belongsTo(Post);

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

app.post('/users/signup', async(req, res, next)=>{
  await User.sync();
  if(schema.validate(req.body.password) === false){
      return res.status(400).json({ error: "mot de passe ne remplit pas les critères de sécurité!"})
  }
  bcrypt.hash(req.body.password, 10)
  .then(async(hash) => {
      await User.create({
          name: req.body.name,
          password: hash
      }).then(user => res.status(201).json(user))
      .catch(err => res.status(500).json({err}));
  }).catch(err => res.status(500).json({err}));
});

app.get('/users/login', async(req, res, next)=>{
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

app.get('/post',auth, async(req, res, next)=>{
  await Post.findAll()
      .then(posts => res.status(200).json(posts))
      .catch(error => res.status(400).json({ error }));
});

app.get('/post/:id',auth, async(req, res, next)=>{
  await Post.findOne({where: {id: req.params.id}})
      .then(post => res.status(200).json(post))
      .catch(error => res.status(404).json({ error }));
});

app.get('/post/:id/comment',auth, async(req, res, next)=>{
  await Com.findAll({where: {postId : req.params.id}})
      .then(coms => res.status(200).json(coms))
      .catch(error => res.status(400).json({ error }));
});

app.post('/post', auth, async(req, res, next)=>{
  await Post.sync();
  await Post.create({
    title: req.body.title,
    article: req.body.article,
    userId: req.body.userId
  })
  .then(post => res.status(201).json(post))
  .catch(error => res.status(400).json({ error }));
});

app.post('/post/:id/comment',auth, async(req, res, next)=>{
  await Com.sync();
  await Com.create({
    text: req.body.text,
    postId: req.params.id,
    userId: req.body.userId
  })
  .then(comment => res.status(201).json(comment))
  .catch(err => res.status(400).json({err}));
});

app.put('/post/:id',auth, async(req, res, next)=>{
  await Post.update({title: req.body.title,
    article: req.body.article
  },{where: {
    id: req.params.id
  }})
  .then(post=> res.status(200).json(post))
  .catch(err => res.status(400).json({err}));
});

app.post('/post/:id/like',auth, async(req, res, next)=>{
  await Like.sync();
  await Like.create({
    userId : req.body.userId,
    postId: req.params.id,
    like: req.body.like
  })
  .then(liked => res.status(200).json({message: "ce post a été liké", liked}))
  .catch(err => res.status(400).json({err}));
});

app.delete('/post/:id',auth, async(req, res, next)=>{
  /*await Post.findOne({where: {id: req.params.id}})
  .then(post => {
    const fileName = post.imageUrl.split('/images/')[1];
    fs.unlink(`images/${fileName}`, async()=>{*/
      await Post.destroy({ where: {id: req.params.id}})
        .then(() => res.status(200).json({ message: 'Post supprimé !'}))
        .catch(error => res.status(400).json({ error }));
    });
  //})
  /*.catch(err => res.status(500).json({err}));  
});*/

app.delete('/post/:id/comment/:comId',auth, async(req, res, next)=>{
  await Com.destroy({where: {id: req.params.comId}})
  .then(()=> res.status(200).json({message: "Commentaire supprimé!"}))
  .catch(err => res.status(400).json({err}));
});

//const postRoutes = require('./routes/post');
//const userRoutes = require('./routes/user');

//app.use('/api/sauces', postRoutes);
//app.use('/api/auth', userRoutes);


module.exports = app;