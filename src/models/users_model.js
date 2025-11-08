const pool = require('../config/db.js')

exports.fetchAll = async () => {
    try {
        const sqlQuery = 'SELECT * FROM users'
        const res = await pool.query(sqlQuery);
        const arr = res.rows;

        const result = [];
        let obj = {};
        arr.forEach(row => {
            obj = {
                id: row.id,
                username: row.username,
                email: row.email,
                role: row.role,
                created_at: row.created_at,
                updated_at: row.updated_at
            }
            result.push(obj)
        });

        return result;
    } catch (err){
        throw new Error('Failed to fetch users ', err)
    }
}

exports.findUserById = async (userId) => {
    try{
        const sqlQuery = 'SELECT * FROM users WHERE id = $1'
        const value = [userId]
        const res = await pool.query(sqlQuery, value)
        const user = res.rows[0]
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            created_at: user.created_at,
            updated_at: user.updated_at
        }
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