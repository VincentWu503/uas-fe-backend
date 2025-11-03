const { Pool } = require('pg');
require('dotenv').config()
 
const pool = new Pool({
    host: process.env.HOST_NAME,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    maxLifetimeSeconds: 60
})

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})

pool.connect( (err, connection) => {
    if (err) throw err;
    console.log('Connected to the PostgreSQL Database.');
    connection.release();
}); 

module.exports = pool;
