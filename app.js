const express = require('express')
const app = express()
const port = 3000
const AdminRoutes = require("./Routes/Admin")
const ProfessorRoutes = require("./Routes/Professor")
const AlunoRoutes = require("./Routes/Aluno")



app.use(express.json());
app.use('/admin', AdminRoutes );
app.use('/prof', ProfessorRoutes );
app.use('/aluno', AlunoRoutes );



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})