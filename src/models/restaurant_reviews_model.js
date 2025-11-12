const pool = require('../config/db.js')

exports.findAll = async (limit, offset) => {
    try{
        const sqlQuery = `SELECT * FROM restaurant_reviews
                    ORDER BY comment_id
                    LIMIT $1 OFFSET $2`
        const res = await pool.query(sqlQuery, [limit, offset]);
        return res.rows;      
    } catch (err){
        throw new Error('Failed to get restaurant reviews', err)
    }
}

exports.addReview = async (stars, comment, overview, userId) => {
    try{
        const sqlQuery = `INSERT INTO restaurant_reviews 
                            (stars, comment, overview, user_id)
                            VALUES ($1, $2, $3, $4) RETURNING *`
        const values = [stars, comment, overview, userId]
        const res = await pool.query(sqlQuery, values)
        return res.rows[0];
    } catch (err){
        console.log(err)
        throw new Error('Failed to add food review', err)
    }
}