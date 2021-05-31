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

module.exports;