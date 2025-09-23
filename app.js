const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const AdminRoutes = require("./src/routes/adminRoutes")
const ProfessorRoutes = require("./src/routes/professorRoutes")
const AlunoRoutes = require("./src/routes/alunoRoutes")
const AuthGoogleRoutes = require("./src/routes/authGoogleRoutes");
const passport = require('./src/config/passport');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const cors = require('cors');
const authMiddleware = require('./src/middlewares/authMiddleware')
require('dotenv').config()

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? "https://projeto-sapex-frontend-git-dev-pedromaravellis-projects.vercel.app" : "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

app.use(session({
  secret: process.env.GOOGLE_CLIENT_SECRET || 'sua_chave_secreta_sessao',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());
app.use('/', AuthGoogleRoutes );
app.use('/admin', AdminRoutes );
app.use('/prof', authMiddleware, ProfessorRoutes );
app.use('/aluno', authMiddleware, AlunoRoutes );



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})