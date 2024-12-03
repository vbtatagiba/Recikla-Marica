'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Verificar se o usuário já existe no banco de dados

    const testUserEmail = `teste@gmail.com`;
    const [users] = await queryInterface.sequelize.query(
      `SELECT * FROM \`Users\` WHERE email = '${testUserEmail}'`
    );

    let testUserObject = 0;

    if (users.length === 0) {
      let testUser = [];
      testUser.push({
        username: 'teste',
        email: 'teste@gmail.com',
        password: await bcrypt.hash('123', 10),
        role: 'usuario',
        cep: '24913613',
        estado: 'RJ',
        cidade: 'Maricá',
        bairro: 'retiro',
        rua: Math.floor(Math.random() * 30) + 1,
        numero: Math.floor(Math.random() * 100) + 1,
        complemento: 'Perto da Padaria do Retiro',
        isAdm: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const createdTestUser = await queryInterface.bulkInsert(
        'Users',
        testUser,
        { returning: true }
      );
      testUserObject = createdTestUser[0];
    } else {
      testUserObject = users[0];
    }

    // Lista de materiais reais para as coletas
    const materials = [
      'lata',
      'garrafa',
      'papelão',
      'plástico',
      'vidro',
      'metal',
      'papel',
      'bateria',
      'eletrônicos',
      'madeira',
    ];

    let allowedAddresses = [
      {
        estado: 'Rio de Janeiro',
        cidade: 'Maricá',
        rua: 'Rua Domicio da Gama',
        cep: '24900-820',
        bairro: 'Eldorado',
        numero: '60',
      },
      {
        estado: 'Rio de Janeiro',
        cidade: 'Rio de Janeiro',
        rua: 'Avenida Atlântica',
        cep: '22021-001',
        bairro: 'Copacabana',
        numero: '3200',
      },
      {
        estado: 'Rio de Janeiro',
        cidade: 'Rio de Janeiro',
        rua: 'Avenida das Américas',
        cep: '22775-900',
        bairro: 'Barra da Tijuca',
        numero: '5000',
      },
      {
        estado: 'São Paulo',
        cidade: 'São Paulo',
        rua: 'Praça da Sé',
        cep: '01001-000',
        bairro: 'Sé',
        numero: 's/n',
      },
      {
        estado: 'São Paulo',
        cidade: 'São Paulo',
        rua: 'Avenida Brasil',
        cep: '01535-000',
        bairro: 'Vila Formosa',
        numero: '850',
      },
      {
        estado: 'Ceará',
        cidade: 'Fortaleza',
        rua: 'Avenida Beira Mar',
        cep: '60110-200',
        bairro: 'Aldeota',
        numero: '1500',
      },
    ];

    // Cria 20 coletas associadas ao usuário
    const coletaData = [];
    for (let i = 1; i <= 20; i++) {
      const randomIndex = Math.floor(Math.random() * allowedAddresses.length);
      const address = allowedAddresses[randomIndex];
      coletaData.push({
        userId: testUserObject.id,
        material: materials[Math.floor(Math.random() * materials.length)],
        quantity: `${Math.floor(Math.random() * 50) + 1}`,
        date: new Date(),
        estado: address.estado,
        cidade: address.cidade,
        rua: address.rua,
        cep: address.cep,
        bairro: address.bairro,
        numero: address.numero,
        complemento: testUserObject.complemento,
        //////////////
        // DEFAULT //
        /////////////
        status: 'aguardando',
        coletorId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Insere todas as coletas no banco de dados
    await queryInterface.bulkInsert('Coleta', coletaData);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Coletas', null, {});
    await queryInterface.bulkDelete('Users', { email: testUserObject.email });
  },
};
