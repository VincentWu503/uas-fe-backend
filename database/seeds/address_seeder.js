const pool = require('../../src/config/db.js')

async function seed(){
  await pool.query('DELETE FROM address');
  try{
    await pool.query(`INSERT INTO address (alamat_lengkap, kelurahan, kabupaten_kota, provinsi)
                        VALUES ('Jl. Tanjung Gedong No. 24 Samping Untar 1', 'Tomang', 'Kota Jakarta Barat', 'Daerah Khusus Jakarta')`)

  } catch (err){
    console.error('An error has occured!', err)
  } finally{
    pool.end()
  }
}

seed();