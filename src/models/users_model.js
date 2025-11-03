const pool = require('../config/db.js')

exports.fetchAll = async () => {
    const sqlQuery = 'SELECT * FROM users'
    const res = await pool.query(sqlQuery);
    return res.rows;
}

exports.fetchUser = async (userId) => {
    const sqlQuery = 'SELECT * FROM users WHERE id = $1'
    const value = [userId]
    const res = await pool.query(sqlQuery, value)
    return res.rows[0];
}

exports.checkEmail = async (email) => {
    const sqlQuery = 'SELECT * FROM users WHERE email = $1'
    const value = [email]
    const res = await pool.query(sqlQuery, value);
    return res.rows
}

exports.checkUsername = async (username) => {
    const sqlQuery = 'SELECT * FROM users WHERE username = $1'
    const value = [username]
    const res = await pool.query(sqlQuery, value);
    return res.rows
}

exports.createUser = async (username, email, hashedPassword) => {
    const sqlQuery = `INSERT INTO users (username, email, password) 
                        VALUES ($1, $2, $3)
                        RETURNING *`
    const values = [username, email, hashedPassword]
    const res = await pool.query(sqlQuery, values)
    console.log(res.rows)
    return res.rows[0]
}