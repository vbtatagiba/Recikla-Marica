const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

// Definição do modelo Coleta
const Coleta = sequelize.define('Coleta', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  material: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'aguardando',
  },
  userId: { // Coluna para a referência ao User
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Modelo referenciado
      key: 'id',   // Chave referenciada
    },
  },
});

// Associação: Coleta pertence a um User
Coleta.belongsTo(User, { as: 'user', foreignKey: 'userId' });

module.exports = Coleta;
