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

// return non credentials
exports.findOne = async (userId) => {
    try{
        const sqlQuery = 'SELECT id, username, role, created_at, updated_at FROM users WHERE id = $1'
        const res = await pool.query(sqlQuery, [userId]);

        return res.rows[0];
    } catch (err) {
        throw new Error('Failed to fetch user ', err);
    }
}

exports.findUserPayloadById = async (userId) => {
    try{
        const sqlQuery = 'SELECT id, username, email, password, role, created_at, updated_at FROM users WHERE id = $1'
        //const value = [userId]
        const res = await pool.query(sqlQuery, [userId])
        return res.rows[0];
    } catch (err){
        throw new Error(`Failed to fetch user with user id ${userId} `, err)
    }
}

exports.findUserByEmail = async (email) => {
    try{
        const sqlQuery = 'SELECT id, username, email, password, role FROM users WHERE email = $1'
        //const value = [email]
        const res = await pool.query(sqlQuery, [email]);
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

exports.resetPassword = async (email, hashedPassword) => {
    try{
        const sqlQuery = `UPDATE users SET password = $1 WHERE email = $2 RETURNING *`
        const values = [hashedPassword, email]
        const res = await pool.query(sqlQuery, values);
        return res.rows[0]
    } catch (err) { 
        // console.log(err)
        throw new Error('Failed to update user password', err);
    }
}

exports.updateUserInfo = async (updates, userId) => {
    try{
        const setClauses = []
        const values = []
        var count = 1

        let clause;
        for (const key in updates){
            clause = key + ' = ' + '$' + count.toString()
            console.log(clause)
            setClauses.push(clause)
            values.push(updates[key])
            count++;
        }

        values.push(userId)
        console.log(values)

        const clausesStr = setClauses.join(', ')

        const sqlQuery = `UPDATE users SET ${clausesStr} 
                            WHERE id = $${count}
                            RETURNING id, username, email`
        const res = await pool.query(sqlQuery, values)
        return res.rows[0]
    } catch (err) {
        console.log(err)
        throw new Error('Failed to update user info', err);
    }
}