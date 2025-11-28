const { hashPassword } = require('../../src/utils/password_encryptor.js');
const pool = require('../../src/config/db.js')

async function seed(){
  await pool.query('DELETE FROM users');
  try{
    const hashedPassword = await hashPassword('admin123')
    let sqlQuery = 'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)'
    let values = ['kumar', 'example@email.com', hashedPassword, 'admin']
    await pool.query(sqlQuery, values)

    sqlQuery = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)'
    values = ['John CENA', 'test@gmail.com', hashedPassword]
    await pool.query(sqlQuery, values)
    console.log('Successfully added users to the database.')
  } catch (err){
    console.error('An error has occured!', err)
  } finally{
    pool.end()
  }
}

seed();
