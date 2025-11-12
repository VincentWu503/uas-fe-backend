const pool = require('../config/db.js')

exports.findAll = async (limit, offset) => {
    try{
        const sqlQuery = `SELECT * FROM food_reviews
                            ORDER BY comment_id
                            LIMIT $1 OFFSET $2`
        const res = await pool.query(sqlQuery, [limit, offset]);
        return res.rows;
    } catch (err) {
        throw new Error('Failed to fetch food items', err)
    }
}

exports.addFoodReview = async (stars, comment, foodId) => {
    try{
        const sqlQuery = `INSERT INTO food_reviews (stars, comment, food_id)
                            VALUES ($1, $2, $3) RETURNING *`
        const values = [stars, comment, foodId]
        const res = await pool.query(sqlQuery, values)
        return res.rows[0];
    } catch (err){
        console.log(err)
        throw new Error('Failed to add food review', err)
    }
}