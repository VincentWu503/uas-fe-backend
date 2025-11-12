const pool = require('../config/db.js')

exports.findAll = async () => {
    try {
        const sqlQuery = 'SELECT id, username, email, role, created_at, updated_at FROM users'
        const res = await pool.query(sqlQuery);

        return res.rows;
    } catch (err){
        throw new Error('Failed to fetch users ', err)
    }
}

exports.findUserById = async (userId) => {
    try{
        const sqlQuery = 'SELECT id, username, email, role, created_at, updated_at FROM users WHERE id = $1'
        const value = [userId]
        const res = await pool.query(sqlQuery, value)
        
        return res.rows[0];
    } catch (err){
        throw new Error(`Failed to fetch user with user id ${userId} `, err)
    }
}

exports.findUserByEmail = async (email) => {
    try{
        const sqlQuery = 'SELECT * FROM users WHERE email = $1'
        const value = [email]
        const res = await pool.query(sqlQuery, value);

        return res.rows[0];
    } catch (err){
        throw new Error('Failed to retrieve user\'s email ', err)
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