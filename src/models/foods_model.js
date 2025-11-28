const pool = require('../config/db.js')

exports.findAllByCategory = async (category, limit, offset) => {
    try{
        const sqlQuery = `SELECT * FROM foods
                            WHERE category = $1
                            ORDER BY item_id
                            LIMIT $2 OFFSET $3`
        const res = await pool.query(sqlQuery, [category, limit, offset]);
        return res.rows;
    } catch (err) {
        console.log(err)
        throw new Error('Failed to fetch food items', err)
    }
}

exports.findAll = async (limit, offset) => {
     try{
        const sqlQuery = `SELECT * FROM foods
                            ORDER BY item_id
                            LIMIT $1 OFFSET $2`
        const res = await pool.query(sqlQuery, [limit, offset]);
        return res.rows;
    } catch (err) {
        console.log(err)
        throw new Error('Failed to fetch food items', err)
    }
}

exports.findOne = async (id) => {
    try{
        const sqlQuery = `SELECT * FROM foods
                        WHERE item_id = $1`
        const res = await pool.query(sqlQuery, [id])
        return res.rows[0]
    } catch (err) {
        throw new Error(`Failed to fetch food with id ${id}`, err)
    }
}

exports.addFood = async (
    item_name,
    category,
    dine_in_price,
    online_price,
    description,
    image_format,
    image_buffer
) => {
    try {
        const sqlQuery = `
            INSERT INTO foods (
            item_name, category, dine_in_price, 
            online_price, description, image_format, image_bytes
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;

        const values = [
            item_name, category, dine_in_price,
            online_price, description, image_format, image_buffer
        ];

        const res = await pool.query(sqlQuery, values);
        return res.rows[0];
    } catch (err) {
        throw new Error('Failed to add food item', err)
    }
}

exports.deleteFood = async (foodId) => {
    try{
        const sqlQuery = 'DELETE FROM foods WHERE item_id = $1 RETURNING *'
        const res = await pool.query(sqlQuery, [foodId]);
        return res.rows[0]
    } catch (err){
        throw new Error('Failed to delete item', err)
    }
}

exports.updateFood = async (foodId, updates) => {
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

        const updatedClause = `updated_at = $${count}`
        setClauses.push(updatedClause)
        values.push('NOW()')
        values.push(foodId)

        console.log(setClauses)
        const clausesStr = setClauses.join(', ')
        console.log(clausesStr)

        const sqlQuery = `UPDATE foods SET ${clausesStr} 
                            WHERE item_id = $${count + 1}
                            RETURNING *`
        const res = await pool.query(sqlQuery, values)
        return res.rows[0]
    } catch (err){
        console.log(err)
        throw new Error(`Failed to update food item with id ${foodId}`, err)
    }
}

exports.countFoods = async () => {
    try{
        const sqlQuery = 'SELECT COUNT(item_id) FROM foods'
        const res = await pool.query(sqlQuery);
        return res.rows[0].count
    } catch (err){
        throw new Error('Failed to count food items', err)
    }
}

exports.countByCategory = async (category) => {
    try{
        const sqlQuery = 'SELECT COUNT(item_id) FROM foods WHERE category = $1'
        const res = await pool.query(sqlQuery, [category]);
        return res.rows[0].count
    } catch (err) {
        throw new Error('Failed to count food items by category', err)
    }
}