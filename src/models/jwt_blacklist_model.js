const pool = require('../config/db.js')

exports.findBlacklistedToken = async (token) => {
    try{
        const sqlQuery = 'SELECT * FROM jwt_blacklist WHERE token = $1';
        const value = [token]
        const res = await pool.query(sqlQuery, value);
        return res.rows[0]
    } catch (err){
        throw new Error('Failed to find blacklisted token', err)
    }
}

exports.addToBlacklist = async (token) => {
    try{
        const sqlQuery = 'INSERT INTO jwt_blacklist (token) VALUES ($1) RETURNING *'
        const value = [token]
        const res = await pool.query(sqlQuery, value);
        return res.rows[0]
    } catch (err){
        throw new Error('Failed to add token to blacklist', err)
    }
}