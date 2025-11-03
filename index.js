const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
require('dotenv').config()
const port = process.env.HOST_PORT || 3000

app.use(bodyParser.json())
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

require('./src/routes/routes.js')(app);

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})