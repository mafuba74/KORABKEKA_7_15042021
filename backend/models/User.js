const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../configsequelize');

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

  module.exports = User;