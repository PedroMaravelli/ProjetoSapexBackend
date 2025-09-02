// app.js
const express = require('express');
const app = express();

// (opcional) carrega .env/.env.ci se existir; se não existir, usamos os padrões abaixo
require('dotenv').config({ path: process.env.DOTENV_FILE || '.env' });

/**
 * Padrões integrados (equivalentes ao seu .env.ci)
 * Obs.: valores definidos no ambiente (process.env) continuam prevalecendo.
 */
const DEFAULTS = {
  NODE_ENV: 'ci',
  PORT: '3000',

  // CORS liberado p/ scanners
  CORS_ORIGIN: '*',

  // Sessão/JWT só p/ CI/dev (troque em produção)
  SESSION_SECRET: 'changeme',
  JWT_SECRET: 'changeme',

  // Google OAuth "dummy" no CI (ninguém vai logar no CI)
  GOOGLE_CLIENT_ID: 'dummy',
  GOOGLE_CLIENT_SECRET: 'dummy',

  // Caso venha a usar DB via docker-compose no CI
  DB_HOST: 'db',
  DB_USER: 'root',
  DB_PASS: 'root',
  DB_NAME: 'mydb',
};

// ENV final = defaults + valores reais do ambiente (ambiente sempre vence)
const ENV = { ...DEFAULTS, ...process.env };

// Porta
const PORT = parseInt(ENV.PORT, 10) || 3000;

const AdminRoutes = require('./src/routes/adminRoutes');
const ProfessorRoutes = require('./src/routes/professorRoutes');
const AlunoRoutes = require('./src/routes/alunoRoutes');
const AuthGoogleRoutes = require('./src/routes/AuthGoogleRoutes');
const passport = require('./src/config/passport');
const session = require('express-session');
const cors = require('cors');

// CORS: '*' vira "liberado" (true). Se quiser restringir, passe uma lista separada por vírgula em CORS_ORIGIN.
const corsOrigin =
  !ENV.CORS_ORIGIN || ENV.CORS_ORIGIN.trim() === '*' ?
    true :
    ENV.CORS_ORIGIN.split(',').map(s => s.trim());

app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());

app.use(session({
  secret: ENV.SESSION_SECRET || 'changeme',
  resave: false,
  saveUninitialized: false,
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Rota de saúde para o pipeline
app.get('/health', (_req, res) => res.status(200).send('ok'));

// (opcional) rota raiz só para feedback rápido
app.get('/', (_req, res) => res.send('SAPEX API up'));

// Suas rotas
app.use('/', AuthGoogleRoutes);
app.use('/admin', AdminRoutes);
app.use('/prof', ProfessorRoutes);
app.use('/aluno', AlunoRoutes);

// Sobe o servidor
app.listen(PORT, () => {
  console.log(`API escutando na porta ${PORT}`);
});
