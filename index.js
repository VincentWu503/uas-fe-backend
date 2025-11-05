const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
require('dotenv').config()
const port = process.env.HOST_PORT || 3000

app.use(bodyParser.json({limit: '2mb'}))
app.use(cors())
app.use(
  bodyParser.urlencoded({
    limit: '2mb',
    extended: true,
  })
)

require('./src/routes/routes.js')(app);

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})