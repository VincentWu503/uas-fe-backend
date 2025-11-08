const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const passport = require('passport')
require('./src/middlewares/passport.js')(passport)
require('dotenv').config()
const port = process.env.HOST_PORT || 3000  

app.use(bodyParser.json({limit: '2mb'}))
app.use(
  bodyParser.urlencoded({
    limit: '2mb',
    extended: true,
  })
)
app.use(cors())
app.use(passport.initialize());

require('./src/routes/routes.js')(app);

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})