const express = require('express')
const app = express()
const port = 3000
const AdminRoutes = require("./src/routes/adminRoutes")
const ProfessorRoutes = require("./src/routes/professorRoutes")
const AlunoRoutes = require("./src/routes/alunoRoutes")
const AuthGoogleRoutes = require("./src/routes/AuthGoogleRoutes");
const passport = require('./src/config/passport');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config()

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(session({
  secret: process.env.GOOGLE_CLIENT_SECRET || 'sua_chave_secreta_sessao',
  resave: false,
  saveUninitialized: false,
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());
app.use('/', AuthGoogleRoutes );
app.use('/admin', AdminRoutes );
app.use('/prof', ProfessorRoutes );
app.use('/aluno', AlunoRoutes );



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})