const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

// Definição do modelo Coletas
const Coletas = sequelize.define(
  'Coletas',
  {
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
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cidade: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rua: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cep: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bairro: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numero: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    complemento: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    userId: {
      // Coluna para a referência ao User
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User, // Modelo referenciado
        key: 'id', // Chave referenciada
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    /////////////
    // DEFAULT //
    /////////////
    status: {
      type: DataTypes.ENUM('aguardando', 'em_andamento', 'concluida'), // Usando ENUM para status fixos
      defaultValue: 'aguardando',
    },
    coletorId: {
      // ID do coletor que aceitou a coleta
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User, // Supondo que o coletor também seja um usuário
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  },
  {
    timestamps: true,
  }
);

// Associação: Coleta pertence a um User (solicitante)
Coletas.belongsTo(User, { as: 'user', foreignKey: 'userId' });
// Associação opcional: Coletor pode ser um User
Coletas.belongsTo(User, { as: 'coletor', foreignKey: 'coletorId' });

module.exports = Coletas;
