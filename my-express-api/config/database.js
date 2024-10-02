const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DB_DIALECT === 'mysql') {
  sequelize = new Sequelize(process.env.MYSQLDATABASE, process.env.MYSQLUSER, process.env.MYSQLPASSWORD, {
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    dialect: 'mysql',
    logging: false,
  });
} else if (process.env.DB_DIALECT === 'postgres') {
  sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    dialect: 'postgres',
    logging: false,
  });
} else {
  throw new Error('Dialect não configurado corretamente!');
}

sequelize.authenticate()
  .then(() => console.log(`Conectado ao banco de dados com sucesso usando ${process.env.DB_DIALECT}!`))
  .catch(err => console.error('Erro ao conectar ao banco de dados:', err));

module.exports = sequelize;
