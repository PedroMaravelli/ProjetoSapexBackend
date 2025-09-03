// app.js
const express = require('express');
const app = express();

// Lê .env/.env.ci se existir; se não, seguimos com defaults
require('dotenv').config({ path: process.env.DOTENV_FILE || '.env' });

// Defaults (podem ser sobrescritos por variáveis reais do ambiente)
const DEFAULTS = {
  NODE_ENV: 'ci',
  PORT: '3000',
  CORS_ORIGIN: '*',
  SESSION_SECRET: 'changeme',
  JWT_SECRET: 'changeme',
  GOOGLE_CLIENT_ID: 'dummy',
  GOOGLE_CLIENT_SECRET: 'dummy',
  DB_HOST: 'db',
  DB_USER: 'root',
  DB_PASS: 'root',
  DB_NAME: 'mydb',
};
const ENV = { ...DEFAULTS, ...process.env };
const PORT = parseInt(ENV.PORT, 10) || 3000;

const AdminRoutes = require('./src/routes/adminRoutes');
const ProfessorRoutes = require('./src/routes/professorRoutes');
const AlunoRoutes = require('./src/routes/alunoRoutes');
const AuthGoogleRoutes = require('./src/routes/AuthGoogleRoutes');
const passport = require('./src/config/passport');
const session = require('express-session');
const cors = require('cors');

// CORS: '*' => libera; lista separada por vírgula => restringe
const corsOrigin =
  !ENV.CORS_ORIGIN || ENV.CORS_ORIGIN.trim() === '*'
    ? true
    : ENV.CORS_ORIGIN.split(',').map(s => s.trim());
app.use(cors({ origin: corsOrigin, credentials: true }));

app.use(express.json());
app.use(session({
  secret: ENV.SESSION_SECRET || 'changeme',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Saúde para o pipeline
app.get('/health', (_req, res) => res.status(200).send('ok'));

// (opcional) raiz
app.get('/', (_req, res) => res.send('SAPEX API up'));

// Rotas
app.use('/', AuthGoogleRoutes);
app.use('/admin', AdminRoutes);
app.use('/prof', ProfessorRoutes);
app.use('/aluno', AlunoRoutes);

// Escuta em TODAS as interfaces (necessário no Docker/GitHub runner)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API escutando na porta ${PORT}`);
});
