const pool = require('../config/db.js')

exports.fetchAll = async () => {
    const sqlQuery = `SELECT * FROM foods
                        ORDER BY item_id
                        LIMIT 8 OFFSET 0`
    const res = await pool.query(sqlQuery);
    return res.rows;
}

exports.addFood = async () => {
    const sqlQuery = `SELECT * FROM foods
                        ORDER BY item_id
                        LIMIT 8 OFFSET 0`
    const res = await pool.query(sqlQuery);
    return res.rows;
}