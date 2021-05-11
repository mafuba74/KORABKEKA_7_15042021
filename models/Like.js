const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../configsequelize');

const Like = sequelize.define('like', {
    like: DataTypes.INTEGER
  });

module.exports = Like;