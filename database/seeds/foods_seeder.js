const pool = require('../../src/config/db.js')

const fs = require('fs').promises;
const path = require('path');

async function getImageBuffer(imageName) {
    try {
        const imagePath = path.join(__dirname, '../../assets/images', imageName);
        const imageBuffer = await fs.readFile(imagePath);
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
      const imageBytea = await getImageBuffer(food.image_name);

      const sqlQuery = `
        INSERT INTO foods (
          item_name, category, dine_in_price, online_price, description, image
        )
        VALUES ($1, $2, $3, $4, $5, $6)
      `;

      const values = [
        food.item_name, food.category, food.dine_in_price,
        food.online_price, food.description, imageBytea
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
