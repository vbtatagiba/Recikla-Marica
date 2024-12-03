'use strict';

const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

faker.locale = 'pt_BR';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [];

    users.push({
      username: 'teste',
      email: 'teste@gmail.com',
      password: await bcrypt.hash('123', 10),
      role: 'usuario',
      estado: 'RJ',
      cidade: 'Maricá',
      rua: Math.floor(Math.random() * 30) + 1,
      cep: '24913613',
      bairro: 'retiro',
      numero: Math.floor(Math.random() * 100) + 1,
      complemento: 'Perto da Padaria do Retiro',
      isAdm: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    for (let i = 0; i < 20; i++) {
      users.push({
        username: faker.internet.username(),
        email: faker.internet.email(),
        password: await bcrypt.hash('123', 10),
        role: 'usuario',
        estado: faker.location.state(),
        cidade: faker.location.city(),
        rua: Math.floor(Math.random() * 30) + 1,
        cep: faker.location.zipCode('#####-###'),
        bairro: 'retiro',
        numero: Math.floor(Math.random() * 100) + 1,
        complemento: faker.location.secondaryAddress(),
        isAdm: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return queryInterface.bulkInsert('Users', users, {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
