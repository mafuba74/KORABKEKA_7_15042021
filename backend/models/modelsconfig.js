const User = require('./User');
const Post = require('./Post');
const Com = require('./Com');
const Like = require('./Like');

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

module.exports = db;