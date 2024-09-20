const express = require('express');
const cors = require('cors'); // Importando CORS
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware para CORS (permitir requests de diferentes origens)
app.use(cors()); // Permite todas as origens por padrão

// Middleware para parsing de JSON
app.use(express.json());

// Roteamento
app.use('/auth', authRoutes);

// Sincronizar banco de dados e iniciar o servidor
sequelize.sync()
  .then(() => {
    app.listen(3000, () => {
      console.log('Server running on port 3000');
    });
  })
  .catch((err) => {
    console.error('Failed to sync database:', err);
  });
