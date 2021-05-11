const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../configsequelize');

const Com = sequelize.define('com', {
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });

module.exports = Com;