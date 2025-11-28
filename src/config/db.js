require('dotenv').config()
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

console.log(process.env.DB_HOST)
console.log(process.env.DB_PORT)
console.log(process.env.DB_USER)
 
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    ssl: {
        rejectUnauthorized: true,
        ca: process.env.CA_CERT || fs.readFileSync(path.join(__dirname, 'ca.pem')).toString(),
    }
})

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})

pool.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    
    client.query("SELECT VERSION()", [], function (err, result) {
        release();
        
        if (err) {
            console.error('Error executing query:', err);
        } else {
            console.log('Database Version:', result.rows[0].version);
            console.log('Connected to the PostgreSQL Database.');
        }
    });
}); 

module.exports = pool;
