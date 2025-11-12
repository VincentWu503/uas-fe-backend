const pool = require('../config/db.js')

exports.findAll = async () => {
    try{
        const sqlQuery = 'SELECT * FROM address'
        const res = await pool.query(sqlQuery);
        return res.rows;
    } catch (err){
        throw new Error('Failed to get addresses', err)
    }
}

exports.findOne = async (id) => {
    try{
        const sqlQuery = `SELECT * FROM address
                        WHERE id = $1`
        const res = await pool.query(sqlQuery, [id])
        return res.rows[0]
    } catch (err) {
        console.log(err)
        throw new Error(`Failed to fetch address with id ${id}`, err)
    }
}

exports.addAddress = async (alamat_lengkap, kelurahan, kabupaten_kota, provinsi) => {
    try{
        const sqlQuery = `INSERT INTO address (alamat_lengkap, kelurahan, kabupaten_kota, provinsi)
                            VALUES ($1, $2, $3, $4) RETURNING *`
        const values = [alamat_lengkap, kelurahan, kabupaten_kota, provinsi]
        const res = await pool.query(sqlQuery, values);
        return res.rows[0];
    } catch (err){
        throw new Error('Failed to add address', err);
    }
}

exports.deleteAddressById = async (id) => {
    try{
        const sqlQuery = 'DELETE FROM address WHERE id = $1 RETURNING *' // Assumes PK is address_id
        const res = await pool.query(sqlQuery, [id]);
        return res.rows[0]
    } catch (err){
        throw new Error('Failed to delete address', err)
    }
}

exports.updateAddressById = async (id, updates) => {
    try{
        const setClauses = []
        const values = []
        var count = 1

        for (const key in updates){
            if (Object.prototype.hasOwnProperty.call(updates, key)) {
                let clause = `${key} = $${count}`
                setClauses.push(clause)
                values.push(updates[key])
                count++;
            }
        }

        values.push(id)

        const clausesStr = setClauses.join(', ')

        const sqlQuery = `UPDATE address SET ${clausesStr} 
                            WHERE id = $${count} 
                            RETURNING *` 
        
        const res = await pool.query(sqlQuery, values)
        return res.rows[0]
    } catch (err){
        console.log(err)
        throw new Error(`Failed to update address item with id ${id}`, err)
    }
}