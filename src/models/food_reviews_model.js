const pool = require('../config/db.js')

exports.findAll = async (foodId, limit, offset) => {
    try{
        const sqlQuery = `SELECT * FROM food_reviews
                            WHERE food_id = $1
                            ORDER BY comment_id
                            LIMIT $2 OFFSET $3`
        const res = await pool.query(sqlQuery, [foodId, limit, offset]);
        return res.rows;
    } catch (err) {
        console.log(err)
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
        // console.log(err)
        throw new Error('Failed to add food review', err)
    }
}

exports.getFoodReviewsOverview = async (foodId) => {
    try {
        const sqlQuery = `SELECT
                            COUNT(comment_id) AS total_reviews,
                            (AVG(COALESCE(stars)))::numeric(2,1) AS average_stars
                            FROM food_reviews
                            WHERE food_id = $1`
        const res = await pool.query(sqlQuery, [foodId])
        return res.rows[0]
    } catch (err) {
        console.log(err)
        throw new Error('Failed to get food reviews overview'. err)
    }
}