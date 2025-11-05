const pool = require('../config/db.js')

exports.fetchAll = async () => {
    try {
        const sqlQuery = 'SELECT * FROM users'
        const res = await pool.query(sqlQuery);
        return res.rows;
    } catch (err){
        throw new Error('Failed to fetch users ', err)
    }
}

exports.fetchUser = async (userId) => {
    try{
        const sqlQuery = 'SELECT * FROM users WHERE id = $1'
        const value = [userId]
        const res = await pool.query(sqlQuery, value)
        return res.rows[0];
    } catch (err){
        throw new Error(`Failed to fetch user with user id ${userId} `, err)
    }
}

exports.checkEmail = async (email) => {
    try{

    } catch (err){
        throw new Error('Failed to retrieve user\'s email ', err)
    }
    const sqlQuery = 'SELECT * FROM users WHERE email = $1'
    const value = [email]
    const res = await pool.query(sqlQuery, value);
    return res.rows
}

exports.checkUsername = async (username) => {
    try{
        const sqlQuery = 'SELECT * FROM users WHERE username = $1'
        const value = [username]
        const res = await pool.query(sqlQuery, value);
        return res.rows
    } catch (err){
        throw new Error('Failed to retrieve username ', err)
    }
}

exports.createUser = async (username, email, hashedPassword) => {
    try {
        const sqlQuery = `INSERT INTO users (username, email, password) 
                            VALUES ($1, $2, $3)
                            RETURNING *`
        const values = [username, email, hashedPassword]
        const res = await pool.query(sqlQuery, values)
        console.log(res.rows)
        return res.rows[0]
    } catch (err){
        throw new Error('Failed to create user', err)
    }
}