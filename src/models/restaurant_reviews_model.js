const pool = require('../config/db.js')

exports.findAll = async (limit, offset) => {
    try{
        const sqlQuery = `SELECT comment_id, stars, comment,
                            array_to_json(overviews) AS overviews,
                            created_at, user_id
                            FROM restaurant_reviews
                            ORDER BY comment_id
                            LIMIT $1 OFFSET $2`
        const res = await pool.query(sqlQuery, [limit, offset]);
        // console.log(res.rows);
        return res.rows;      
    } catch (err){
        console.log(err)
        throw new Error('Failed to get restaurant reviews', err)
    }
}

exports.addReview = async (stars, comment, overviews, userId) => {
    try{
        const sqlQuery = `INSERT INTO restaurant_reviews 
                            (overviews, stars, comment, user_id)
                            VALUES ($1::review_overviews[], $2, $3, $4) RETURNING *`
        const values = [overviews, stars, comment, userId]
        const res = await pool.query(sqlQuery, values)
        return res.rows[0];
    } catch (err){
        console.log(err)
        throw new Error('Failed to add food review', err)
    }
}

exports.countReviews = async () => {
    try{
        const sqlQuery = 'SELECT COUNT(*) FROM restaurant_reviews'
        const res = await pool.query(sqlQuery);
        return res.rows[0].count
    } catch (err){
        throw new Error('Failed to count restaurant reviews', err)
    }
}

exports.countAverageRating = async () => {
    try{
        const sqlQuery = `SELECT (AVG(COALESCE(stars)))::numeric(2,1) 
                            AS average_rating FROM restaurant_reviews`;
        const res = await pool.query(sqlQuery);
        return res.rows[0].average_rating;
    } catch (err) {
        console.log(err);
        throw new Error('Failed to count average restaurant reviews rating', err)
    }
}