const express = require('express')
const app = express()
const port = 3000
const AdminRoutes = require("./Routes/Admin")
const ProfessorRoutes = require("./Routes/Professor")
const AlunoRoutes = require("./Routes/Aluno")
const passport = require('./config/passport');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config()

app.use(cors());
app.use(express.json());
app.use(session({
  secret: process.env.GOOGLE_CLIENT_SECRET || 'sua_chave_secreta_sessao',
  resave: false,
  saveUninitialized: false,
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());
app.use('/admin', AdminRoutes );
app.use('/prof', ProfessorRoutes );
app.use('/aluno', AlunoRoutes );



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})