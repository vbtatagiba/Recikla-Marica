require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

module.exports = {
  development: {
    username: process.env.DB_DIALECT === 'mysql' ? process.env.MYSQLUSER : process.env.PGUSER,
    password: process.env.DB_DIALECT === 'mysql' ? process.env.MYSQLPASSWORD : process.env.PGPASSWORD,
    database: process.env.DB_DIALECT === 'mysql' ? process.env.MYSQLDATABASE : process.env.PGDATABASE,
    host: process.env.DB_DIALECT === 'mysql' ? process.env.MYSQLHOST : process.env.PGHOST,
    port: process.env.DB_DIALECT === 'mysql' ? process.env.MYSQLPORT : process.env.PGPORT,
    dialect: process.env.DB_DIALECT,
  },
  test: {
    username: process.env.DB_DIALECT === 'mysql' ? process.env.MYSQLUSER : process.env.PGUSER,
    password: process.env.DB_DIALECT === 'mysql' ? process.env.MYSQLPASSWORD : process.env.PGPASSWORD,
    database: process.env.DB_DIALECT === 'mysql' ? process.env.MYSQLDATABASE : process.env.PGDATABASE,
    host: process.env.DB_DIALECT === 'mysql' ? process.env.MYSQLHOST : process.env.PGHOST,
    port: process.env.DB_DIALECT === 'mysql' ? process.env.MYSQLPORT : process.env.PGPORT,
    dialect: process.env.DB_DIALECT,
  },
  production: {
    username: process.env.DB_DIALECT === 'mysql' ? process.env.MYSQLUSER : process.env.PGUSER,
    password: process.env.DB_DIALECT === 'mysql' ? process.env.MYSQLPASSWORD : process.env.PGPASSWORD,
    database: process.env.DB_DIALECT === 'mysql' ? process.env.MYSQLDATABASE : process.env.PGDATABASE,
    host: process.env.DB_DIALECT === 'mysql' ? process.env.MYSQLHOST : process.env.PGHOST,
    port: process.env.DB_DIALECT === 'mysql' ? process.env.MYSQLPORT : process.env.PGPORT,
    dialect: process.env.DB_DIALECT,
  }
};
