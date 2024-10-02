// config/db.postgres.config.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  dialect: 'postgres',
  logging: false,
});

sequelize.authenticate()
  .then(() => console.log('Conectado ao PostgreSQL com sucesso!'))
  .catch(err => console.error('Erro ao conectar ao banco de dados:', err));

module.exports = sequelize;
