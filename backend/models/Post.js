const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../configsequelize');

const Post = sequelize.define('post', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    article: DataTypes.TEXT,
    allowNull: false,
    imageUrl: {
      type: DataTypes.STRING
    }
  });

  module.exports = Post;