const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Definição do modelo User
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,  // Validação para garantir que o email seja válido
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isAdm: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
});

module.exports = User;
