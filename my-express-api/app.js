const express = require('express');
const cors = require('cors'); // Importando CORS
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const coletasRoutes = require('./routes/coletaRoutes');
const app = express();

// Middleware para CORS (permitir requests de diferentes origens)
app.use(cors()); // Permite todas as origens por padrão

// Middleware para parsing de JSON
app.use(express.json());

// Roteamento
app.use('/auth', authRoutes);
app.use('/api', coletasRoutes);

// Definir a porta a partir da variável de ambiente ou usar 3001 como padrão
const PORT_SERVER = process.env.PORT_SERVER || 3001;

// Sincronizar banco de dados e iniciar o servidor
sequelize.sync()
  .then(() => {
    app.listen(PORT_SERVER, () => {
      console.log(`Server running on port ${PORT_SERVER}`);
    });
  })
  .catch((err) => {
    console.error('Failed to sync database:', err);
  });
