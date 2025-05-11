const express = require('express')
const app = express()
const port = 3000
const AdminRoutes = require("./Routes/Admin")

app.use(express.json());
app.use('/admin', AdminRoutes );

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})