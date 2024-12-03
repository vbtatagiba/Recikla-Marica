const express = require('express');
const cors = require('cors'); // Importando CORS
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const coletasRoutes = require('./routes/coletaRoutes');
const locationRoutes = require('./routes/location.routes');
const path = require('path');

const app = express();
app.set('trust proxy', true);

// Middleware para CORS (permitir requests de diferentes origens)
app.use(cors()); // Permite todas as origens por padrão

// Middleware para parsing de JSON
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));
// Roteamento
app.use('/auth', authRoutes);
app.use('/api', coletasRoutes);
app.use('/location', locationRoutes);

////////////////
// RUN SERVER //
////////////////
// Definir a porta a partir da variável de ambiente ou usar 3001 como padrão
const PORT_SERVER = process.env.PORT_SERVER || 3001;

// Sincronizar banco de dados e iniciar o servidor
sequelize
  .sync()
  .then(() => {
    app.listen(PORT_SERVER, () => {
      console.log(`Server running on port ${PORT_SERVER}`);
    });
  })
  .catch((err) => {
    console.error('Failed to sync database:', err);
  });

/////////////////////
// LOGIN VIA GMAIL //
/////////////////////
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Carregar variáveis de ambiente
require('dotenv').config();

// Configuração de Sessão
app.use(
  session({
    secret: process.env.JWT_SECRET, // Coloque uma chave segura
    resave: false,
    saveUninitialized: true,
  })
);

// Inicializar Passport e Sessão
app.use(passport.initialize());
app.use(passport.session());

// Configuração do Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3001/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

// Serializar e Desserializar Usuário
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Rota para iniciar o login com Google
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:3000/auth/login?error=auth_failed',
  }),
  (req, res) => {
    // Redireciona para o frontend com um parâmetro indicando sucesso
    res.redirect('http://localhost:3000/auth/login?success=true');
  }
);
