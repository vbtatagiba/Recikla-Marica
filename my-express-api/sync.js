// Script de sincronização manual para atualização do banco de dados.
// Para rodar, execute: node sync.js

const sequelize = require('./config/database');

sequelize.sync({ alter: true }) // Atualiza o banco para refletir mudanças no modelo
  .then(() => {
    console.log('Banco de dados atualizado com sucesso!');
    process.exit(0); // Finaliza o script
  })
  .catch((err) => {
    console.error('Erro ao atualizar o banco de dados:', err);
    process.exit(1); // Finaliza com erro
  });
