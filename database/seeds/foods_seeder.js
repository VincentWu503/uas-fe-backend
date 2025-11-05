const pool = require('../../src/config/db.js')
const fs = require('fs').promises
const path = require('path');
const sharp = require('sharp');

async function getImageBuffer(imagePath) {
    try {
        const imageBuffer = await fs.readFile(imagePath);
        // console.log(imagePath);
        return imageBuffer;
    } catch (error) {
        console.error('Error reading image file:', error);
        throw error;
    }
}

async function seed() {
  try {
    let foodsData = await fs.readFile('./assets/json/foods-body.json', 'utf8');
    const foods = JSON.parse(foodsData);

    await pool.query('DELETE FROM foods');

    for (const food of foods) {
      const imagePath = path.join(__dirname, '../../assets/images', food.image_name);
      let meta = await sharp(imagePath).metadata()
      let imageFormat = meta.format
      // console.log(meta)
      const imageBytea = await getImageBuffer(imagePath);
      // console.log(imageBytea.toString('base64').substring(0, 12))

      const sqlQuery = `
        INSERT INTO foods (
          item_name, category, dine_in_price, online_price, description, image_format, image_bytes
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;

      const values = [
        food.item_name, food.category, food.dine_in_price,
        food.online_price, food.description, imageFormat, imageBytea
      ];

      await pool.query(sqlQuery, values);
    }
  } catch (err) {
    console.error('An error has occurred:', err);
  } finally {
    await pool.end();
  }
}

seed();
