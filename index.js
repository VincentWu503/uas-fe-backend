const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const passport = require('passport')
const pool = require('./src/config/db.js')
require('./src/middlewares/passport.js')(passport)
require('dotenv').config()
const port = process.env.HOST_PORT || 3000  

app.use(cors())
app.use(bodyParser.json({limit: '2mb'}))
app.use(
  bodyParser.urlencoded({
    limit: '2mb',
    extended: true,
  })
)
app.use(passport.initialize());
// auto delete blacklisted token
const intervalMs = 3600 * 1000
setInterval(async () =>{
  try{
    await pool.query(`DELETE FROM jwt_blacklist 
      WHERE EXTRACT(EPOCH FROM (NOW() - blacklisted_at)) > 3600`)
  } catch (err){
  }
}, intervalMs)

require('./src/routes/routes.js')(app);

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})