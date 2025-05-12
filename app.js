const express = require('express')
const app = express()
const port = 3000
const AdminRoutes = require("./Routes/Admin")
const ProfessorRoutes = require("./Routes/Professor")


app.use(express.json());
app.use('/admin', AdminRoutes );
app.use('/prof', ProfessorRoutes );


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})